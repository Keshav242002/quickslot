class ApiConstants {
  // Override at build time for any target device:
  //   Android emulator (default) : flutter run
  //   iOS simulator              : flutter run --dart-define=API_BASE_URL=http://127.0.0.1:8000/api
  //   Physical device / LAN      : flutter run --dart-define=API_BASE_URL=http://192.168.x.x:8000/api
  //   Render production          : flutter run --dart-define=API_BASE_URL=https://quickslot-api.onrender.com/api
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8000/api',
  );

  static const String authSync = '/auth/sync/';
  static const String venues = '/venues/';
  static const String bookings = '/bookings/';
  static const String myBookings = '/me/bookings/';

  static String venueSlots(int venueId) => '/venues/$venueId/slots/';
  static String venueSlotsPoll(int venueId) => '/venues/$venueId/slots/poll/';
  static String cancelBooking(int bookingId) => '/bookings/$bookingId/';
}
