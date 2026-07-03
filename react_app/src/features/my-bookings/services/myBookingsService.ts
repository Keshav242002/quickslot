import { axiosClient } from '@/core/api/axiosClient';
import { API_ROUTES } from '@/core/api/apiConstants';
import type { Booking } from '@/types/api';

export async function getMyBookings(): Promise<Booking[]> {
  const { data } = await axiosClient.get<Booking[]>(API_ROUTES.myBookings);
  return data;
}

export async function cancelBooking(bookingId: number): Promise<void> {
  await axiosClient.delete(API_ROUTES.booking(bookingId));
}
