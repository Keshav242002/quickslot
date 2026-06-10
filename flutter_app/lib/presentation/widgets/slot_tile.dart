import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/slot_model.dart';

class SlotTile extends StatelessWidget {
  final SlotModel slot;
  final bool isSelected;
  final bool isBooking;
  final VoidCallback? onTap;

  const SlotTile({
    super.key,
    required this.slot,
    this.isSelected = false,
    this.isBooking = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color bgColor;
    final Color borderColor;
    final Color textColor;

    if (slot.isBooked) {
      bgColor = AppTheme.bookedColor.withAlpha(26);
      borderColor = AppTheme.bookedColor.withAlpha(77);
      textColor = AppTheme.bookedColor;
    } else if (isSelected) {
      bgColor = AppTheme.selectedColor.withAlpha(51);
      borderColor = AppTheme.selectedColor;
      textColor = AppTheme.selectedColor;
    } else {
      bgColor = AppTheme.availableColor.withAlpha(20);
      borderColor = AppTheme.availableColor.withAlpha(77);
      textColor = AppTheme.availableColor;
    }

    return GestureDetector(
      onTap: slot.isBooked ? null : onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: borderColor, width: isSelected ? 1.5 : 1),
        ),
        child: Center(
          child: isBooking
              ? SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: textColor,
                  ),
                )
              : Text(
                  slot.displayStartTime,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 11,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
        ),
      ),
    );
  }
}
