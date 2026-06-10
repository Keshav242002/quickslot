part of 'slot_bloc.dart';

abstract class SlotEvent extends Equatable {
  const SlotEvent();
  @override
  List<Object?> get props => [];
}

class SlotFetchRequested extends SlotEvent {
  final int venueId;
  final String date;
  const SlotFetchRequested({required this.venueId, required this.date});
  @override
  List<Object?> get props => [venueId, date];
}

class SlotSelected extends SlotEvent {
  final int slotId;
  const SlotSelected({required this.slotId});
  @override
  List<Object?> get props => [slotId];
}

class SlotBookRequested extends SlotEvent {
  final int slotId;
  const SlotBookRequested({required this.slotId});
  @override
  List<Object?> get props => [slotId];
}

class SlotPollingStarted extends SlotEvent {
  const SlotPollingStarted();
}

class SlotPollingTick extends SlotEvent {
  final int venueId;
  final String date;
  const SlotPollingTick({required this.venueId, required this.date});
  @override
  List<Object?> get props => [venueId, date];
}
