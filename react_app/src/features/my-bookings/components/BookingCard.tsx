import { Button } from '@/shared/components/Button';
import { getSportEmoji } from '@/features/venues/utils/sportIcons';
import { formatDisplayDate, formatTime } from '@/core/utils/dateUtils';
import type { Booking } from '@/types/api';
import styles from './BookingCard.module.css';

export interface BookingCardProps {
  booking: Booking;
  onCancel: (id: number) => void;
}

export function isUpcoming(booking: Booking): boolean {
  const slotDateTime = new Date(`${booking.slot.date}T${booking.slot.end_time}`);
  return slotDateTime > new Date();
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const { venue, slot } = booking;
  const price = parseFloat(venue.price_per_hour);

  return (
    <div className={styles.card}>
      <div>
        <p className={styles.name}>
          {getSportEmoji(venue.sport_type)} {venue.name}
        </p>
        <p className={styles.sport}>{venue.sport_type}</p>
        <p className={styles.meta}>📅 {formatDisplayDate(new Date(slot.date))}</p>
        <p className={styles.meta}>
          ⏰ {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
        </p>
        <p className={styles.price}>💰 ₹{price}</p>
      </div>
      {isUpcoming(booking) ? (
        <Button variant="secondary" size="sm" onClick={() => onCancel(booking.id)}>
          Cancel
        </Button>
      ) : null}
    </div>
  );
}
