import datetime
from unittest.mock import patch

from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Booking, Slot, User, Venue

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

FAKE_TOKEN = {
    'uid': 'test-uid-001',
    'email': 'player@test.com',
    'name': 'Test Player',
}

FAKE_TOKEN_2 = {
    'uid': 'test-uid-002',
    'email': 'player2@test.com',
    'name': 'Other Player',
}

AUTH_HEADER = {'HTTP_AUTHORIZATION': 'Bearer fake-test-token'}


def _patch_firebase(token=None):
    """Context manager: replace Firebase token verification with a fake decoded token."""
    return patch('bookings.middleware.auth.verify_id_token', return_value=token or FAKE_TOKEN)


def _make_slot(venue, date=None, hour=10, is_booked=False):
    if date is None:
        date = datetime.date.today() + datetime.timedelta(days=1)
    return Slot.objects.create(
        venue=venue,
        date=date,
        start_time=datetime.time(hour, 0),
        end_time=datetime.time(hour + 1, 0),
        is_booked=is_booked,
    )


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class BookingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.venue = Venue.objects.create(
            name='Test Court',
            sport_type='badminton',
            location='Test City',
            price_per_hour=100,
        )
        self.user = User.objects.create(
            firebase_uid=FAKE_TOKEN['uid'],
            name=FAKE_TOKEN['name'],
            email=FAKE_TOKEN['email'],
        )
        self.user2 = User.objects.create(
            firebase_uid=FAKE_TOKEN_2['uid'],
            name=FAKE_TOKEN_2['name'],
            email=FAKE_TOKEN_2['email'],
        )

    # --- venue list ---

    def test_venue_list(self):
        with _patch_firebase():
            resp = self.client.get('/api/venues/', **AUTH_HEADER)
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.json()), 1)

    # --- slot list ---

    def test_slot_list_requires_date(self):
        with _patch_firebase():
            resp = self.client.get(f'/api/venues/{self.venue.id}/slots/', **AUTH_HEADER)
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()['error'], 'missing_param')

    # --- create booking ---

    def test_create_booking_success(self):
        slot = _make_slot(self.venue)
        with _patch_firebase():
            resp = self.client.post(
                '/api/bookings/',
                {'slot_id': slot.id},
                format='json',
                **AUTH_HEADER,
            )
        self.assertEqual(resp.status_code, 201)
        slot.refresh_from_db()
        self.assertTrue(slot.is_booked)

    def test_booking_already_booked_slot(self):
        slot = _make_slot(self.venue, is_booked=True)
        Booking.objects.create(user=self.user2, slot=slot)
        with _patch_firebase():
            resp = self.client.post(
                '/api/bookings/',
                {'slot_id': slot.id},
                format='json',
                **AUTH_HEADER,
            )
        self.assertEqual(resp.status_code, 409)

    def test_booking_past_slot(self):
        past_date = datetime.date.today() - datetime.timedelta(days=1)
        slot = _make_slot(self.venue, date=past_date)
        with _patch_firebase():
            resp = self.client.post(
                '/api/bookings/',
                {'slot_id': slot.id},
                format='json',
                **AUTH_HEADER,
            )
        self.assertEqual(resp.status_code, 400)

    # --- cancel booking ---

    def test_cancel_booking_success(self):
        slot = _make_slot(self.venue, is_booked=True)
        booking = Booking.objects.create(user=self.user, slot=slot)
        with _patch_firebase():
            resp = self.client.delete(
                f'/api/bookings/{booking.id}/',
                **AUTH_HEADER,
            )
        self.assertEqual(resp.status_code, 204)
        slot.refresh_from_db()
        self.assertFalse(slot.is_booked)

    def test_cancel_other_users_booking(self):
        slot = _make_slot(self.venue, is_booked=True)
        booking = Booking.objects.create(user=self.user2, slot=slot)
        with _patch_firebase():
            resp = self.client.delete(
                f'/api/bookings/{booking.id}/',
                **AUTH_HEADER,
            )
        self.assertEqual(resp.status_code, 403)

    # --- DB-level uniqueness ---

    def test_double_booking_db_constraint(self):
        """OneToOne on Slot→Booking must raise IntegrityError at the DB level."""
        slot = _make_slot(self.venue)
        Booking.objects.create(user=self.user, slot=slot)
        with self.assertRaises(IntegrityError):
            Booking.objects.create(user=self.user2, slot=slot)

    # --- slot polling ---

    def test_slot_polling_returns_changed(self):
        future_date = datetime.date.today() + datetime.timedelta(days=1)
        slot = _make_slot(self.venue, date=future_date)
        slot.is_booked = True
        slot.save()
        since_dt = slot.updated_at - datetime.timedelta(seconds=1)
        # Use data= dict so the test client properly URL-encodes '+' in the tz offset
        with _patch_firebase():
            resp = self.client.get(
                f'/api/venues/{self.venue.id}/slots/poll/',
                data={'date': str(future_date), 'since': since_dt.isoformat()},
                **AUTH_HEADER,
            )
        self.assertEqual(resp.status_code, 200)
        returned_ids = [s['id'] for s in resp.json()]
        self.assertIn(slot.id, returned_ids)

    def test_slot_polling_excludes_unchanged(self):
        """Slots not modified after 'since' must be absent from poll results."""
        future_date = datetime.date.today() + datetime.timedelta(days=2)
        slot = _make_slot(self.venue, date=future_date)
        since_dt = slot.updated_at + datetime.timedelta(seconds=10)
        with _patch_firebase():
            resp = self.client.get(
                f'/api/venues/{self.venue.id}/slots/poll/',
                data={'date': str(future_date), 'since': since_dt.isoformat()},
                **AUTH_HEADER,
            )
        self.assertEqual(resp.status_code, 200)
        returned_ids = [s['id'] for s in resp.json()]
        self.assertNotIn(slot.id, returned_ids)
