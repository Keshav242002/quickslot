import { axiosClient } from '@/core/api/axiosClient';
import { API_ROUTES } from '@/core/api/apiConstants';
import type { Venue } from '@/types/api';

export async function getVenues(): Promise<Venue[]> {
  const { data } = await axiosClient.get<Venue[]>(API_ROUTES.venues);
  return data;
}
