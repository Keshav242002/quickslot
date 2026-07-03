import { useQuery } from '@tanstack/react-query';
import { getVenues } from '../services/venueService';

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
    staleTime: 5 * 60 * 1000,
  });
}
