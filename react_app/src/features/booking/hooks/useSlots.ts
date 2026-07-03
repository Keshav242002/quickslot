import { useQuery } from '@tanstack/react-query';
import { getSlots } from '../services/slotService';

export function useSlots(venueId: number, date: string) {
  return useQuery({
    queryKey: ['slots', venueId, date],
    queryFn: () => getSlots(venueId, date),
    staleTime: 0,
    gcTime: 30_000,
  });
}
