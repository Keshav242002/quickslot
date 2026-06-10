import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/date_utils.dart';
import '../../core/constants/app_constants.dart';
import '../../data/models/venue_model.dart';
import '../../data/models/slot_model.dart';
import '../../data/repositories/venue_repository.dart';
import '../../data/repositories/booking_repository.dart';
import '../blocs/slot/slot_bloc.dart';
import '../widgets/slot_grid.dart';
import '../widgets/loading_widget.dart';
import '../widgets/error_widget.dart';
import '../widgets/empty_state_widget.dart';

class VenueDetailScreen extends StatelessWidget {
  final VenueModel venue;
  const VenueDetailScreen({super.key, required this.venue});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => SlotBloc(
        context.read<VenueRepository>(),
        context.read<BookingRepository>(),
      ),
      child: _VenueDetailView(venue: venue),
    );
  }
}

class _VenueDetailView extends StatefulWidget {
  final VenueModel venue;
  const _VenueDetailView({required this.venue});

  @override
  State<_VenueDetailView> createState() => _VenueDetailViewState();
}

class _VenueDetailViewState extends State<_VenueDetailView> {
  late DateTime _selectedDate;
  late List<DateTime> _dates;

  @override
  void initState() {
    super.initState();
    _dates = AppDateUtils.getNextDays(AppConstants.futureDaysForSlots);
    _selectedDate = _dates.first;
    _fetchSlots();
    context.read<SlotBloc>().add(const SlotPollingStarted());
  }

  void _fetchSlots() {
    context.read<SlotBloc>().add(SlotFetchRequested(
          venueId: widget.venue.id,
          date: AppDateUtils.formatDate(_selectedDate),
        ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.venue.name)),
      body: BlocListener<SlotBloc, SlotState>(
        listener: (context, state) {
          if (state is SlotBookingSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('✅ Booking confirmed!'),
                backgroundColor: AppTheme.availableColor,
              ),
            );
          } else if (state is SlotBookingConflict) {
            _showConflictDialog(context, state.message);
          } else if (state is SlotError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppTheme.errorColor),
            );
          }
        },
        child: Column(
          children: [
            Expanded(
              child: CustomScrollView(
                slivers: [
                  SliverToBoxAdapter(child: _buildVenueInfo(context)),
                  SliverToBoxAdapter(child: _buildDatePicker(context)),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                      child: Text('Available Slots',
                          style: Theme.of(context).textTheme.titleMedium),
                    ),
                  ),
                  SliverToBoxAdapter(child: _buildSlotSection()),
                  const SliverToBoxAdapter(child: SizedBox(height: 100)),
                ],
              ),
            ),
            _buildBookButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildVenueInfo(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withAlpha(13)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Text(widget.venue.sportEmoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 8),
            Text(widget.venue.sportType,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(color: AppTheme.accentGreen)),
          ]),
          const SizedBox(height: 8),
          Row(children: [
            const Icon(Icons.location_on_rounded, size: 16, color: AppTheme.textSecondary),
            const SizedBox(width: 4),
            Expanded(
                child: Text(widget.venue.location,
                    style: Theme.of(context).textTheme.bodyMedium)),
          ]),
          const SizedBox(height: 4),
          Row(children: [
            const Icon(Icons.currency_rupee_rounded, size: 16, color: AppTheme.textSecondary),
            Text('${widget.venue.pricePerHour.toStringAsFixed(0)}/hr',
                style: Theme.of(context).textTheme.bodyMedium),
          ]),
          if (widget.venue.description.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(widget.venue.description,
                style: Theme.of(context).textTheme.bodyMedium,
                maxLines: 2,
                overflow: TextOverflow.ellipsis),
          ],
        ],
      ),
    );
  }

  Widget _buildDatePicker(BuildContext context) {
    return SizedBox(
      height: 72,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _dates.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final date = _dates[index];
          final isSelected = AppDateUtils.formatDate(date) ==
              AppDateUtils.formatDate(_selectedDate);
          return GestureDetector(
            onTap: () {
              setState(() => _selectedDate = date);
              _fetchSlots();
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 56,
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.accentGreen : AppTheme.cardColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? AppTheme.accentGreen : Colors.white.withAlpha(13),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    AppDateUtils.formatDayName(date),
                    style: TextStyle(
                      fontSize: 11,
                      color: isSelected ? AppTheme.primaryBg : AppTheme.textSecondary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    AppDateUtils.formatDayShort(date),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? AppTheme.primaryBg : AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSlotSection() {
    return BlocBuilder<SlotBloc, SlotState>(
      builder: (context, state) {
        if (state is SlotLoading) {
          return const AppLoadingWidget(type: LoadingType.slotGrid);
        }
        if (state is SlotError) {
          return AppErrorWidget(message: state.message, onRetry: _fetchSlots);
        }
        if (state is SlotEmpty) {
          return const AppEmptyWidget(
            title: 'No slots available',
            subtitle: 'Try a different date.',
            icon: Icons.event_busy_rounded,
          );
        }

        List<SlotModel> slots = [];
        int? selectedId;
        int? bookingId;

        if (state is SlotLoaded) {
          slots = state.slots;
          selectedId = state.selectedSlotId;
        } else if (state is SlotBookingInProgress) {
          slots = state.slots;
          bookingId = state.bookingSlotId;
        }

        if (slots.isEmpty) return const SizedBox.shrink();

        return SlotGrid(
          slots: slots,
          selectedSlotId: selectedId,
          bookingSlotId: bookingId,
          onSlotTap: (slot) {
            context.read<SlotBloc>().add(SlotSelected(slotId: slot.id));
          },
        );
      },
    );
  }

  Widget _buildBookButton(BuildContext context) {
    return BlocBuilder<SlotBloc, SlotState>(
      builder: (context, state) {
        if (state is! SlotLoaded || state.selectedSlotId == null) {
          return const SizedBox.shrink();
        }
        final slot = state.slots.firstWhere((s) => s.id == state.selectedSlotId);
        return Container(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            border: Border(top: BorderSide(color: Colors.white.withAlpha(13))),
          ),
          child: ElevatedButton(
            onPressed: () => _showConfirmSheet(context, slot),
            child: Text('Book Now — ${slot.displayStartTime}'),
          ),
        );
      },
    );
  }

  void _showConfirmSheet(BuildContext context, SlotModel slot) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Confirm Booking', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 20),
            _confirmRow(context, widget.venue.sportEmoji, widget.venue.name),
            const SizedBox(height: 8),
            _confirmRow(context, '📅',
                AppDateUtils.formatDisplayDate(DateTime.parse(slot.date))),
            const SizedBox(height: 8),
            _confirmRow(context, '⏰', slot.displayRange),
            const SizedBox(height: 8),
            _confirmRow(context, '💰',
                '₹${widget.venue.pricePerHour.toStringAsFixed(0)}'),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(0, 50),
                      side: const BorderSide(color: Color(0xFF2D3748)),
                    ),
                    child: const Text('Cancel',
                        style: TextStyle(color: AppTheme.textPrimary)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      context
                          .read<SlotBloc>()
                          .add(SlotBookRequested(slotId: slot.id));
                    },
                    style: ElevatedButton.styleFrom(minimumSize: const Size(0, 50)),
                    child: const Text('Confirm ✓'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _confirmRow(BuildContext context, String emoji, String text) {
    return Row(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 10),
        Expanded(child: Text(text, style: Theme.of(context).textTheme.bodyLarge)),
      ],
    );
  }

  void _showConflictDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        title: const Text('⚠️ Slot Unavailable'),
        content: Text(message),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
