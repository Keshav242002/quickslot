import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyBookings, cancelBooking } from '../services/myBookingsService';
import { saveBookingsToCache, loadBookingsFromCache } from '../services/localCacheService';
import { useToast } from '@/shared/components/Toast';
import type { Booking } from '@/types/api';

export function useMyBookings() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const bookings = await getMyBookings();
      saveBookingsToCache(bookings);
      return bookings;
    },
  });

  const cachedBookings = query.isError ? loadBookingsFromCache() : null;
  const bookings = query.isError ? (cachedBookings ?? []) : (query.data ?? []);
  const fromCache = query.isError && cachedBookings !== null;

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onMutate: async (bookingId: number) => {
      await queryClient.cancelQueries({ queryKey: ['myBookings'] });
      const previous = queryClient.getQueryData<Booking[]>(['myBookings']);
      queryClient.setQueryData<Booking[]>(['myBookings'], (old) =>
        (old ?? []).filter((b) => b.id !== bookingId),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['myBookings'], context?.previous);
      toast.error('Failed to cancel booking. Please try again.');
    },
    onSuccess: () => {
      toast.success('Booking cancelled.');
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });

  return { ...query, bookings, fromCache, cancelMutation };
}
