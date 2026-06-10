part of 'slot_bloc.dart';

abstract class SlotState extends Equatable {
  const SlotState();
  @override
  List<Object?> get props => [];
}

class SlotInitial extends SlotState {
  const SlotInitial();
}

class SlotLoading extends SlotState {
  const SlotLoading();
}

class SlotLoaded extends SlotState {
  final List<SlotModel> slots;
  final int? selectedSlotId;

  const SlotLoaded({required this.slots, this.selectedSlotId});

  SlotLoaded copyWith({
    List<SlotModel>? slots,
    int? selectedSlotId,
    bool clearSelected = false,
  }) {
    return SlotLoaded(
      slots: slots ?? this.slots,
      selectedSlotId: clearSelected ? null : (selectedSlotId ?? this.selectedSlotId),
    );
  }

  @override
  List<Object?> get props => [slots, selectedSlotId];
}

class SlotEmpty extends SlotState {
  const SlotEmpty();
}

class SlotBookingInProgress extends SlotState {
  final List<SlotModel> slots;
  final int bookingSlotId;
  const SlotBookingInProgress({required this.slots, required this.bookingSlotId});
  @override
  List<Object?> get props => [slots, bookingSlotId];
}

class SlotBookingSuccess extends SlotState {
  final BookingModel booking;
  const SlotBookingSuccess({required this.booking});
  @override
  List<Object?> get props => [booking];
}

class SlotBookingConflict extends SlotState {
  final String message;
  const SlotBookingConflict({required this.message});
  @override
  List<Object?> get props => [message];
}

class SlotError extends SlotState {
  final String message;
  const SlotError({required this.message});
  @override
  List<Object?> get props => [message];
}
