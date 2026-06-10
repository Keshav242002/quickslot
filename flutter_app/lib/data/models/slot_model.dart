import 'package:equatable/equatable.dart';
import '../../core/utils/date_utils.dart';

class SlotModel extends Equatable {
  final int id;
  final int venueId;
  final String date;
  final String startTime;
  final String endTime;
  final bool isBooked;

  const SlotModel({
    required this.id,
    required this.venueId,
    required this.date,
    required this.startTime,
    required this.endTime,
    required this.isBooked,
  });

  factory SlotModel.fromJson(Map<String, dynamic> json) => SlotModel(
        id: json['id'],
        venueId: json['venue_id'] ?? 0,
        date: json['date'],
        startTime: json['start_time'],
        endTime: json['end_time'],
        isBooked: json['is_booked'] ?? false,
      );

  int get startHour => int.parse(startTime.split(':')[0]);

  String get displayStartTime => AppDateUtils.formatTime(startTime);
  String get displayEndTime => AppDateUtils.formatTime(endTime);
  String get displayRange => '$displayStartTime – $displayEndTime';

  @override
  List<Object?> get props => [id, venueId, date, startTime, endTime, isBooked];
}
