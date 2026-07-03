import { Skeleton } from '@/shared/components/Skeleton';
import styles from './VenueCard.module.css';
import skeletonStyles from './VenueCardSkeleton.module.css';

export function VenueCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true" data-testid="venue-card-skeleton">
      <Skeleton variant="rect" height={180} className={skeletonStyles.image} />
      <div className={styles.body}>
        <Skeleton variant="text" width="70%" height={16} className={skeletonStyles.line} />
        <Skeleton variant="text" width="50%" height={13} className={skeletonStyles.line} />
        <Skeleton variant="text" width="35%" height={14} />
      </div>
    </div>
  );
}
