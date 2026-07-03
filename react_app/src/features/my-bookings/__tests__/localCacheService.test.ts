import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveBookingsToCache,
  loadBookingsFromCache,
  clearBookingsCache,
} from '../services/localCacheService';
import type { Booking } from '@/types/api';

const mockBooking: Booking = {
  id: 1,
  slot: {
    id: 1,
    venue_id: 1,
    date: '2026-07-03',
    start_time: '09:00:00',
    end_time: '10:00:00',
    is_booked: true,
  },
  venue: {
    id: 1,
    name: 'City Sports Arena',
    sport_type: 'badminton',
    location: 'Koramangala',
    description: '',
    image_url: '',
    price_per_hour: '500.00',
  },
  booked_at: '2026-07-03T08:00:00Z',
};

beforeEach(() => {
  localStorage.clear();
});

describe('localCacheService', () => {
  it('saveBookingsToCache serialises to localStorage', () => {
    saveBookingsToCache([mockBooking]);
    expect(localStorage.getItem('quickslot_my_bookings')).toBe(JSON.stringify([mockBooking]));
  });

  it('loadBookingsFromCache returns null when nothing saved', () => {
    expect(loadBookingsFromCache()).toBeNull();
  });

  it('loadBookingsFromCache deserialises correctly', () => {
    saveBookingsToCache([mockBooking]);
    expect(loadBookingsFromCache()).toEqual([mockBooking]);
  });

  it('loadBookingsFromCache returns null on corrupted JSON', () => {
    localStorage.setItem('quickslot_my_bookings', '{not valid json');
    expect(loadBookingsFromCache()).toBeNull();
  });

  it('clearBookingsCache removes the key', () => {
    saveBookingsToCache([mockBooking]);
    clearBookingsCache();
    expect(localStorage.getItem('quickslot_my_bookings')).toBeNull();
  });
});
