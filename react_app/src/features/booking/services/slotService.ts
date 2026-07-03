import { axiosClient } from '@/core/api/axiosClient';
import { API_ROUTES } from '@/core/api/apiConstants';
import type { Slot } from '@/types/api';

export async function getSlots(venueId: number, date: string): Promise<Slot[]> {
  const { data } = await axiosClient.get<Slot[]>(API_ROUTES.venueSlots(venueId), {
    params: { date },
  });
  return data;
}

export async function getSlotsDelta(
  venueId: number,
  date: string,
  since: string,
): Promise<Slot[]> {
  const { data } = await axiosClient.get<Slot[]>(API_ROUTES.venueSlotsPoll(venueId), {
    params: { date, since },
  });
  return data;
}
