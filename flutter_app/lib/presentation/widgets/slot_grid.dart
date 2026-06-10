import 'package:flutter/material.dart';
import '../../data/models/slot_model.dart';
import 'slot_tile.dart';

class SlotGrid extends StatelessWidget {
  final List<SlotModel> slots;
  final int? selectedSlotId;
  final int? bookingSlotId;
  final void Function(SlotModel) onSlotTap;

  const SlotGrid({
    super.key,
    required this.slots,
    required this.onSlotTap,
    this.selectedSlotId,
    this.bookingSlotId,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 1.1,
      ),
      itemCount: slots.length,
      itemBuilder: (context, index) {
        final slot = slots[index];
        return SlotTile(
          slot: slot,
          isSelected: selectedSlotId == slot.id,
          isBooking: bookingSlotId == slot.id,
          onTap: () => onSlotTap(slot),
        );
      },
    );
  }
}
