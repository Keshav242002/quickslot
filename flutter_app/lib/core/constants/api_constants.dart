class ApiConstants {
  // Override at build time for any target device:
  //   Local (Android emulator)   : flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8000/api
  //   Local (iOS simulator)      : flutter run --dart-define=API_BASE_URL=http://127.0.0.1:8000/api
  //   Local (physical device/LAN): flutter run --dart-define=API_BASE_URL=http://192.168.x.x:8000/api
  //   Render production (default): flutter run
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://quickslot-api-7p9g.onrender.com/api',
  );

  static const String authSync = '/auth/sync/';
  static const String venues = '/venues/';
  static const String bookings = '/bookings/';
  static const String myBookings = '/me/bookings/';

  static String venueSlots(int venueId) => '/venues/$venueId/slots/';
  static String venueSlotsPoll(int venueId) => '/venues/$venueId/slots/poll/';
  static String cancelBooking(int bookingId) => '/bookings/$bookingId/';
}
