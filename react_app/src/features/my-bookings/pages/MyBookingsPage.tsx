import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '../hooks/useMyBookings';
import { BookingCard } from '../components/BookingCard';
import { BookingCardSkeleton } from '../components/BookingCardSkeleton';
import { CancelConfirmModal } from '../components/CancelConfirmModal';
import { CacheBanner } from '../components/CacheBanner';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { BottomNav } from '@/shared/components/BottomNav';
import { Button } from '@/shared/components/Button';
import { parseApiError } from '@/core/utils/errorUtils';
import styles from './MyBookingsPage.module.css';

export function MyBookingsPage() {
  const navigate = useNavigate();
  const { bookings, fromCache, isLoading, isError, error, refetch, cancelMutation } =
    useMyBookings();
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleConfirmCancel() {
    if (cancelTargetId === null) return;
    cancelMutation.mutate(cancelTargetId, {
      onSettled: () => setCancelTargetId(null),
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.appBar}>
        <span className={styles.title}>My Bookings</span>
        <button
          type="button"
          className={styles.refreshButton}
          aria-label="Refresh"
          onClick={() => refetch()}
        >
          🔄
        </button>
      </header>

      {fromCache ? <CacheBanner /> : null}

      <main className={styles.content}>
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => <BookingCardSkeleton key={i} />)
        ) : isError && bookings.length === 0 ? (
          <ErrorState message={parseApiError(error)} onRetry={() => refetch()} />
        ) : bookings.length === 0 ? (
          <EmptyState title="No bookings yet" subtitle="Find a venue and book your first slot" icon="📋">
            <Button variant="primary" onClick={() => navigate('/venues')}>
              Browse Venues →
            </Button>
          </EmptyState>
        ) : (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={setCancelTargetId} />
          ))
        )}
      </main>

      <CancelConfirmModal
        isOpen={cancelTargetId !== null}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancel}
        loading={cancelMutation.isPending}
      />

      <BottomNav />
    </div>
  );
}
