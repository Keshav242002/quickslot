import { Skeleton } from '@/shared/components/Skeleton';
import styles from './BookingCard.module.css';

export function BookingCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true" data-testid="booking-card-skeleton">
      <div style={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={12} />
        <Skeleton variant="text" width="50%" height={13} />
        <Skeleton variant="text" width="45%" height={13} />
      </div>
    </div>
  );
}
