import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DateStrip } from '../components/DateStrip';
import { TimeFilterChips, matchesTimeFilter } from '../components/TimeFilterChips';
import { SlotGrid } from '../components/SlotGrid';
import { BookingModal } from '../components/BookingModal';
import { ConflictModal } from '../components/ConflictModal';
import { useSlots } from '../hooks/useSlots';
import { useBookingStore } from '../hooks/useBookingStore';
import { createBooking } from '../services/bookingService';
import { getSportEmoji } from '@/features/venues/utils/sportIcons';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { Skeleton } from '@/shared/components/Skeleton';
import { Button } from '@/shared/components/Button';
import { useToast } from '@/shared/components/Toast';
import { parseApiError, SlotAlreadyBookedError } from '@/core/utils/errorUtils';
import { getNextDays, formatDate, formatTime } from '@/core/utils/dateUtils';
import { getVenues } from '@/features/venues/services/venueService';
import type { Venue } from '@/types/api';
import styles from './VenueDetailPage.module.css';

export function VenueDetailPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const id = Number(venueId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const cachedVenues = queryClient.getQueryData<Venue[]>(['venues']);
  const { data: fetchedVenues } = useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
    staleTime: 5 * 60 * 1000,
    enabled: !cachedVenues,
  });
  const venue = (cachedVenues ?? fetchedVenues)?.find((v) => v.id === id);

  const dates = useMemo(() => getNextDays(7), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const dateKey = formatDate(selectedDate);

  const { selectedSlotId, bookingSlotId, timeFilter, selectSlot, setTimeFilter, setBookingSlot } =
    useBookingStore();

  const [isModalOpen, setModalOpen] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const { data: slots, isLoading, isError, error, refetch } = useSlots(id, dateKey);

  useEffect(() => {
    selectSlot(null);
  }, [dateKey, selectSlot]);

  const filteredSlots = useMemo(
    () => (slots ?? []).filter((s) => matchesTimeFilter(s.start_time, timeFilter)),
    [slots, timeFilter],
  );

  const selectedSlot = filteredSlots.find((s) => s.id === selectedSlotId) ?? null;

  function handleSlotTap(slot: { id: number; is_booked: boolean }) {
    if (slot.is_booked) {
      toast.error('This slot is already booked');
      return;
    }
    selectSlot(slot.id === selectedSlotId ? null : slot.id);
  }

  async function handleConfirm() {
    if (!selectedSlot) return;
    setBookingSlot(selectedSlot.id);
    try {
      await createBooking(selectedSlot.id);
      toast.success('Booking confirmed!');
      setModalOpen(false);
      navigate('/venues');
    } catch (err) {
      if (err instanceof SlotAlreadyBookedError) {
        setModalOpen(false);
        setConflictMessage(err.message);
        queryClient.invalidateQueries({ queryKey: ['slots', id, dateKey] });
      } else {
        toast.error(parseApiError(err));
      }
    } finally {
      setBookingSlot(null);
    }
  }

  function handleConflictClose() {
    setConflictMessage(null);
    selectSlot(null);
  }

  if (!venue) {
    return (
      <div className={styles.page}>
        <Skeleton variant="rect" height={200} />
      </div>
    );
  }

  const price = parseFloat(venue.price_per_hour);

  return (
    <div className={styles.page}>
      <header className={styles.appBar}>
        <button
          type="button"
          className={styles.backButton}
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <span className={styles.appBarTitle}>{venue.name}</span>
      </header>

      {venue.image_url ? (
        <img className={styles.hero} src={venue.image_url} alt="" />
      ) : (
        <div className={styles.heroPlaceholder} aria-hidden="true">
          {getSportEmoji(venue.sport_type)}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <p className={styles.name}>{venue.name}</p>
          <p className={styles.meta}>
            {getSportEmoji(venue.sport_type)} {venue.sport_type}
          </p>
          <p className={styles.meta}>📍 {venue.location}</p>
          <p className={styles.price}>₹{price}/hr</p>
          {venue.description ? <p className={styles.description}>{venue.description}</p> : null}
        </div>

        <DateStrip dates={dates} selectedDate={selectedDate} onChange={setSelectedDate} />
        <TimeFilterChips selected={timeFilter} onChange={setTimeFilter} />

        <p className={styles.sectionLabel}>Available Slots</p>

        {isLoading ? (
          <div className={styles.skeletonGrid}>
            <Skeleton variant="rect" height={44} count={9} />
          </div>
        ) : isError ? (
          <ErrorState message={parseApiError(error)} onRetry={() => refetch()} />
        ) : filteredSlots.length === 0 ? (
          <EmptyState title="No slots available" subtitle="Try a different date" icon="🕒" />
        ) : (
          <SlotGrid
            slots={filteredSlots}
            selectedSlotId={selectedSlotId}
            bookingSlotId={bookingSlotId}
            onSlotTap={handleSlotTap}
          />
        )}
      </div>

      {selectedSlot ? (
        <div className={styles.stickyBar}>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Book Now — {formatTime(selectedSlot.start_time)}
          </Button>
        </div>
      ) : null}

      {selectedSlot ? (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
          slot={selectedSlot}
          venue={venue}
          loading={bookingSlotId === selectedSlot.id}
        />
      ) : null}

      <ConflictModal
        isOpen={conflictMessage !== null}
        onClose={handleConflictClose}
        message={conflictMessage ?? ''}
      />
    </div>
  );
}
