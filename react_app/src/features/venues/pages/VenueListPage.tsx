import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVenues } from '../hooks/useVenues';
import { useVenueFilterStore } from '../hooks/useVenueFilterStore';
import { VenueCard } from '../components/VenueCard';
import { VenueCardSkeleton } from '../components/VenueCardSkeleton';
import { SportFilterBar } from '../components/SportFilterBar';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { BottomNav } from '@/shared/components/BottomNav';
import { parseApiError } from '@/core/utils/errorUtils';
import styles from './VenueListPage.module.css';

export function VenueListPage() {
  const { data: venues, isLoading, isError, error, refetch } = useVenues();
  const { selectedSport, setSelectedSport } = useVenueFilterStore();
  const navigate = useNavigate();

  const sports = useMemo(
    () => [...new Set((venues ?? []).map((v) => v.sport_type))],
    [venues],
  );

  const displayVenues = useMemo(() => {
    if (!venues) return [];
    return selectedSport === 'all'
      ? venues
      : venues.filter((v) => v.sport_type === selectedSport);
  }, [venues, selectedSport]);

  return (
    <div className={styles.page}>
      <header className={styles.appBar}>
        <span className={styles.logo}>QuickSlot ⚡</span>
      </header>

      <main className={styles.content}>
        {venues && venues.length > 0 ? (
          <SportFilterBar
            sports={sports}
            selected={selectedSport}
            onChange={setSelectedSport}
          />
        ) : null}

        {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 3 }, (_, i) => (
              <VenueCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message={parseApiError(error)} onRetry={() => refetch()} />
        ) : displayVenues.length === 0 ? (
          <EmptyState
            title="No venues found"
            subtitle="Check back later for new venues"
            icon="🏟️"
          />
        ) : (
          <div className={styles.grid}>
            {displayVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onClick={() => navigate(`/venues/${venue.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
