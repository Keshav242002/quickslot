import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../data/models/slot_model.dart';
import '../../../data/models/booking_model.dart';
import '../../../data/repositories/venue_repository.dart';
import '../../../data/repositories/booking_repository.dart';
import '../../../core/network/api_exceptions.dart';

part 'slot_event.dart';
part 'slot_state.dart';

class SlotBloc extends Bloc<SlotEvent, SlotState> {
  final VenueRepository _venueRepository;
  final BookingRepository _bookingRepository;
  Timer? _pollingTimer;
  int? _currentVenueId;
  String? _currentDate;

  SlotBloc(this._venueRepository, this._bookingRepository)
      : super(const SlotInitial()) {
    on<SlotFetchRequested>(_onFetch);
    on<SlotSelected>(_onSelected);
    on<SlotBookRequested>(_onBook);
    on<SlotPollingStarted>(_onPollingStarted);
    on<SlotPollingTick>(_onPollingTick);
  }

  Future<void> _onFetch(SlotFetchRequested event, Emitter<SlotState> emit) async {
    _currentVenueId = event.venueId;
    _currentDate = event.date;
    emit(const SlotLoading());
    try {
      final slots = await _venueRepository.getSlots(event.venueId, event.date);
      if (slots.isEmpty) {
        emit(const SlotEmpty());
      } else {
        emit(SlotLoaded(slots: slots));
      }
    } catch (e) {
      emit(SlotError(message: e.toString()));
    }
  }

  void _onSelected(SlotSelected event, Emitter<SlotState> emit) {
    if (state is SlotLoaded) {
      final current = state as SlotLoaded;
      final newId = current.selectedSlotId == event.slotId ? null : event.slotId;
      emit(current.copyWith(selectedSlotId: newId, clearSelected: newId == null));
    }
  }

  Future<void> _onBook(SlotBookRequested event, Emitter<SlotState> emit) async {
    if (state is! SlotLoaded) return;
    final loaded = state as SlotLoaded;
    emit(SlotBookingInProgress(slots: loaded.slots, bookingSlotId: event.slotId));
    try {
      final booking = await _bookingRepository.bookSlot(event.slotId);
      emit(SlotBookingSuccess(booking: booking));
      // Refresh slots after successful booking
      if (_currentVenueId != null && _currentDate != null) {
        add(SlotFetchRequested(venueId: _currentVenueId!, date: _currentDate!));
      }
    } on SlotAlreadyBookedException catch (e) {
      emit(SlotBookingConflict(message: e.message));
      if (_currentVenueId != null && _currentDate != null) {
        add(SlotFetchRequested(venueId: _currentVenueId!, date: _currentDate!));
      }
    } catch (e) {
      emit(SlotError(message: e.toString()));
    }
  }

  void _onPollingStarted(SlotPollingStarted event, Emitter<SlotState> emit) {
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 10), (_) {
      if (_currentVenueId != null && _currentDate != null) {
        add(SlotPollingTick(venueId: _currentVenueId!, date: _currentDate!));
      }
    });
  }

  Future<void> _onPollingTick(SlotPollingTick event, Emitter<SlotState> emit) async {
    // Silent refresh — don't show loading indicator
    try {
      final slots = await _venueRepository.getSlots(event.venueId, event.date);
      if (state is SlotLoaded) {
        final current = state as SlotLoaded;
        emit(current.copyWith(slots: slots));
      } else if (slots.isNotEmpty) {
        emit(SlotLoaded(slots: slots));
      }
    } catch (_) {
      // Silently ignore polling errors
    }
  }

  @override
  Future<void> close() {
    _pollingTimer?.cancel();
    return super.close();
  }
}
