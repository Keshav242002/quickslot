from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from bookings.models import Venue, Slot, User


VENUES = [
    {
        'name': 'Shuttle Zone',
        'sport_type': 'badminton',
        'location': 'Koramangala, Bangalore',
        'description': 'Premium badminton court with wooden flooring',
        'image_url': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
        'price_per_hour': 600,
    },
    {
        'name': 'Smash Arena',
        'sport_type': 'badminton',
        'location': 'Indiranagar, Bangalore',
        'description': 'Professional badminton academy with synthetic courts',
        'image_url': 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800',
        'price_per_hour': 700,
    },
    {
        'name': 'Green Turf',
        'sport_type': 'football',
        'location': 'HSR Layout, Bangalore',
        'description': 'Full-size artificial turf football ground with floodlights',
        'image_url': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        'price_per_hour': 1500,
    },
    {
        'name': 'Goal Street',
        'sport_type': 'football',
        'location': 'Whitefield, Bangalore',
        'description': 'Mini football turf with 5-a-side and 7-a-side options',
        'image_url': 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
        'price_per_hour': 1200,
    },
    {
        'name': 'Ace Court',
        'sport_type': 'tennis',
        'location': 'JP Nagar, Bangalore',
        'description': 'Hard court tennis with coaching available',
        'image_url': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        'price_per_hour': 800,
    },
]

TEST_USERS = [
    {'firebase_uid': 'test-user-001', 'name': 'Arjun Sharma', 'email': 'arjun@test.com'},
    {'firebase_uid': 'test-user-002', 'name': 'Priya Nair', 'email': 'priya@test.com'},
    {'firebase_uid': 'test-user-003', 'name': 'Rahul Verma', 'email': 'rahul@test.com'},
]


class Command(BaseCommand):
    help = 'Seeds database with venues, slots for 7 days, and test users'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing seed data...')
        Slot.objects.all().delete()
        Venue.objects.all().delete()

        self.stdout.write('Creating venues...')
        venues = []
        for v in VENUES:
            venue = Venue.objects.create(**v)
            venues.append(venue)
            self.stdout.write(f'  Created: {venue}')

        self.stdout.write('Generating slots (6AM–10PM for 7 days)...')
        today = date.today()
        slot_count = 0
        for day_offset in range(7):
            target_date = today + timedelta(days=day_offset)
            for venue in venues:
                for hour in range(6, 22):
                    Slot.objects.get_or_create(
                        venue=venue,
                        date=target_date,
                        start_time=time(hour, 0),
                        defaults={'end_time': time(hour + 1, 0)},
                    )
                    slot_count += 1

        self.stdout.write(f'  Created {slot_count} slots across {len(venues)} venues × 7 days')

        self.stdout.write('Creating test users...')
        for u in TEST_USERS:
            user, created = User.objects.update_or_create(
                firebase_uid=u['firebase_uid'],
                defaults={'name': u['name'], 'email': u['email']},
            )
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {user}')

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
