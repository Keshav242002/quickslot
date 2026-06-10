from django.db import models


class User(models.Model):
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class Venue(models.Model):
    SPORT_CHOICES = [
        ('badminton', 'Badminton'),
        ('football', 'Football'),
        ('tennis', 'Tennis'),
        ('cricket', 'Cricket'),
        ('basketball', 'Basketball'),
    ]
    name = models.CharField(max_length=255)
    sport_type = models.CharField(max_length=50, choices=SPORT_CHOICES)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.name} ({self.sport_type})"


class Slot(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('venue', 'date', 'start_time')
        ordering = ['date', 'start_time']

    def __str__(self):
        return f"{self.venue.name} | {self.date} {self.start_time}-{self.end_time}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    slot = models.OneToOneField(Slot, on_delete=models.CASCADE, related_name='booking')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} → {self.slot}"
