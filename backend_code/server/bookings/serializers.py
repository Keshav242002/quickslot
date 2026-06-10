from rest_framework import serializers
from .models import User, Venue, Slot, Booking


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['id', 'name', 'sport_type', 'location', 'description', 'image_url', 'price_per_hour']


class SlotSerializer(serializers.ModelSerializer):
    venue_id = serializers.IntegerField(source='venue.id', read_only=True)

    class Meta:
        model = Slot
        fields = ['id', 'venue_id', 'date', 'start_time', 'end_time', 'is_booked']


class SlotMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = ['id', 'date', 'start_time', 'end_time']


class VenueMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['id', 'name', 'sport_type', 'location']


class BookingSerializer(serializers.ModelSerializer):
    slot = SlotMinimalSerializer(read_only=True)
    venue = VenueMinimalSerializer(source='slot.venue', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'slot', 'venue', 'booked_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'firebase_uid']
