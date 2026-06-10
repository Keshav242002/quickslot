from datetime import datetime

from django.db import IntegrityError
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Slot, Venue, Booking
from .serializers import (
    BookingSerializer,
    SlotSerializer,
    UserSerializer,
    VenueSerializer,
)
from .services import BookingService, ConflictError


def _generate_slots_for_date(venue, target_date):
    """Lazily generate hourly slots 6AM–10PM for a venue on a date if they don't exist."""
    from datetime import time
    slots = []
    for hour in range(6, 22):
        slot, _ = Slot.objects.get_or_create(
            venue=venue,
            date=target_date,
            start_time=time(hour, 0),
            defaults={'end_time': time(hour + 1, 0)},
        )
        slots.append(slot)
    return slots


class VenueListView(APIView):
    def get(self, request):
        venues = Venue.objects.all()
        return Response(VenueSerializer(venues, many=True).data)


class SlotListView(APIView):
    def get(self, request, pk):
        date_param = request.query_params.get('date')
        if not date_param:
            return Response(
                {"error": "missing_param", "message": "Query parameter 'date' is required (YYYY-MM-DD)"},
                status=400,
            )
        try:
            target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "invalid_date", "message": "Date must be in YYYY-MM-DD format"},
                status=400,
            )

        try:
            venue = Venue.objects.get(pk=pk)
        except Venue.DoesNotExist:
            return Response({"error": "not_found", "message": "Venue not found"}, status=404)

        _generate_slots_for_date(venue, target_date)
        slots = Slot.objects.filter(venue=venue, date=target_date)
        if target_date == timezone.localdate():
            slots = slots.filter(start_time__gt=timezone.localtime(timezone.now()).time())
        return Response(SlotSerializer(slots, many=True).data)


class BookingCreateView(APIView):
    def post(self, request):
        try:
            booking = BookingService.create_booking(
                slot_id=request.data.get('slot_id'),
                user=request.firebase_user,
            )
            return Response(BookingSerializer(booking).data, status=201)
        except ConflictError as e:
            return Response(
                {"error": "slot_already_booked", "message": str(e)},
                status=409,
            )
        except IntegrityError:
            return Response(
                {"error": "slot_already_booked", "message": "This slot has already been booked."},
                status=409,
            )
        except ValueError as e:
            return Response({"error": "invalid_input", "message": str(e)}, status=400)


class BookingDeleteView(APIView):
    def delete(self, request, pk):
        try:
            BookingService.cancel_booking(
                booking_id=pk,
                user=request.firebase_user,
            )
            return Response(status=204)
        except ValueError as e:
            return Response({"error": "not_found", "message": str(e)}, status=404)
        except PermissionError as e:
            return Response({"error": "forbidden", "message": str(e)}, status=403)


class UserBookingListView(APIView):
    def get(self, request):
        bookings = (
            Booking.objects
            .filter(user=request.firebase_user)
            .select_related('slot', 'slot__venue')
            .order_by('-booked_at')
        )
        return Response(BookingSerializer(bookings, many=True).data)


class AuthSyncView(APIView):
    def post(self, request):
        return Response(UserSerializer(request.firebase_user).data)


class SlotPollView(APIView):
    def get(self, request, pk):
        date_param = request.query_params.get('date')
        since_param = request.query_params.get('since')
        if not date_param or not since_param:
            return Response(
                {"error": "missing_param", "message": "Both 'date' (YYYY-MM-DD) and 'since' (ISO 8601) are required"},
                status=400,
            )
        try:
            target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "invalid_date", "message": "Date must be in YYYY-MM-DD format"},
                status=400,
            )
        since_dt = parse_datetime(since_param.replace('Z', '+00:00'))
        if since_dt is None:
            return Response(
                {"error": "invalid_since", "message": "Parameter 'since' must be a valid ISO 8601 datetime"},
                status=400,
            )
        try:
            venue = Venue.objects.get(pk=pk)
        except Venue.DoesNotExist:
            return Response({"error": "not_found", "message": "Venue not found"}, status=404)

        slots = Slot.objects.filter(venue=venue, date=target_date, updated_at__gt=since_dt)
        return Response(SlotSerializer(slots, many=True).data)
