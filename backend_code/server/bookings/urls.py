from django.urls import path
from . import views

urlpatterns = [
    path('venues/', views.VenueListView.as_view()),
    path('venues/<int:pk>/slots/', views.SlotListView.as_view()),
    path('bookings/', views.BookingCreateView.as_view()),
    path('bookings/<int:pk>/', views.BookingDeleteView.as_view()),
    path('me/bookings/', views.UserBookingListView.as_view()),
    path('auth/sync/', views.AuthSyncView.as_view()),
    path('venues/<int:pk>/slots/poll/', views.SlotPollView.as_view()),
]
