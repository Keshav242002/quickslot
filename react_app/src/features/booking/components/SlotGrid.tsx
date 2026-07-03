import { SlotTile } from './SlotTile';
import type { Slot, SlotStatus } from '@/types/api';
import styles from './SlotGrid.module.css';

export interface SlotGridProps {
  slots: Slot[];
  selectedSlotId: number | null;
  bookingSlotId: number | null;
  onSlotTap: (slot: Slot) => void;
}

function getStatus(
  slot: Slot,
  selectedSlotId: number | null,
  bookingSlotId: number | null,
): SlotStatus {
  if (slot.id === bookingSlotId) return 'booking';
  if (slot.is_booked) return 'booked';
  if (slot.id === selectedSlotId) return 'selected';
  return 'available';
}

export function SlotGrid({ slots, selectedSlotId, bookingSlotId, onSlotTap }: SlotGridProps) {
  return (
    <div className={styles.grid}>
      {slots.map((slot) => (
        <SlotTile
          key={slot.id}
          slot={slot}
          status={getStatus(slot, selectedSlotId, bookingSlotId)}
          onTap={() => onSlotTap(slot)}
        />
      ))}
    </div>
  );
}
