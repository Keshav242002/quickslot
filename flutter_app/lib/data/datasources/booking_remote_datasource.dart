import '../../core/network/api_client.dart';
import '../../core/constants/api_constants.dart';
import '../../core/utils/app_logger.dart';
import '../models/booking_model.dart';

class BookingRemoteDataSource {
  final ApiClient _client;

  BookingRemoteDataSource(this._client);

  Future<BookingModel> createBooking(int slotId) async {
    AppLogger.api('createBooking → POST ${ApiConstants.bookings} slot=$slotId');
    final response = await _client.post(
      ApiConstants.bookings,
      data: {'slot_id': slotId},
    );
    AppLogger.api('createBooking ✓');
    return BookingModel.fromJson(response.data);
  }

  Future<List<BookingModel>> getMyBookings() async {
    AppLogger.api('getMyBookings → GET ${ApiConstants.myBookings}');
    final response = await _client.get(ApiConstants.myBookings);
    final bookings = (response.data as List).map((e) => BookingModel.fromJson(e)).toList();
    AppLogger.api('getMyBookings ✓ — ${bookings.length} bookings');
    return bookings;
  }

  Future<void> cancelBooking(int bookingId) async {
    AppLogger.api('cancelBooking → DELETE booking=$bookingId');
    await _client.delete(ApiConstants.cancelBooking(bookingId));
    AppLogger.api('cancelBooking ✓');
  }
}
