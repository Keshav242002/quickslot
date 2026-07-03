import { isAxiosError } from 'axios';
import { axiosClient } from '@/core/api/axiosClient';
import { API_ROUTES } from '@/core/api/apiConstants';
import { SlotAlreadyBookedError } from '@/core/utils/errorUtils';
import type { Booking } from '@/types/api';

export async function createBooking(slotId: number): Promise<Booking> {
  try {
    const { data } = await axiosClient.post<Booking>(API_ROUTES.bookings, { slot_id: slotId });
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 409) {
      throw new SlotAlreadyBookedError();
    }
    throw err;
  }
}
