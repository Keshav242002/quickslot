import type { Booking } from '@/types/api';

const CACHE_KEY = 'quickslot_my_bookings';

export function saveBookingsToCache(bookings: Booking[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(bookings));
}

export function loadBookingsFromCache(): Booking[] | null {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return null;
  }
}

export function clearBookingsCache(): void {
  localStorage.removeItem(CACHE_KEY);
}
