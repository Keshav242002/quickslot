import clsx from 'clsx';
import { formatTime } from '@/core/utils/dateUtils';
import type { Slot, SlotStatus } from '@/types/api';
import styles from './SlotTile.module.css';

export interface SlotTileProps {
  slot: Slot;
  status: SlotStatus;
  onTap: () => void;
}

export function SlotTile({ slot, status, onTap }: SlotTileProps) {
  const isBooked = status === 'booked';
  const isBooking = status === 'booking';

  return (
    <div
      className={clsx(styles.tile, styles[status])}
      role="button"
      tabIndex={isBooked ? -1 : 0}
      aria-pressed={status === 'selected'}
      aria-disabled={isBooked}
      onClick={() => {
        if (!isBooked) onTap();
      }}
      onKeyDown={(e) => {
        if (isBooked) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTap();
        }
      }}
    >
      {isBooking ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
    </div>
  );
}
