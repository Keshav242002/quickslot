import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { formatDisplayDate, formatTime } from '@/core/utils/dateUtils';
import type { Slot, Venue } from '@/types/api';
import styles from './BookingModal.module.css';

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  slot: Slot;
  venue: Venue;
  loading: boolean;
}

export function BookingModal({ isOpen, onClose, onConfirm, slot, venue, loading }: BookingModalProps) {
  if (!isOpen) return null;

  const price = parseFloat(venue.price_per_hour);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Booking">
      <p className={styles.row}>🏸 {venue.name}</p>
      <p className={styles.row}>📅 {formatDisplayDate(new Date(slot.date))}</p>
      <p className={styles.row}>
        ⏰ {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
      </p>
      <p className={styles.row}>💰 ₹{price}</p>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} loading={loading}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
