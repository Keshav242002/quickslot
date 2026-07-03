import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMyBookings } from '../hooks/useMyBookings';
import * as myBookingsService from '../services/myBookingsService';
import * as localCacheService from '../services/localCacheService';

vi.mock('../services/myBookingsService');

const mockBooking = {
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

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('useMyBookings', () => {
  it('fetches and returns bookings on success', async () => {
    vi.mocked(myBookingsService.getMyBookings).mockResolvedValue([mockBooking]);
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.bookings).toEqual([mockBooking]);
  });

  it('saves to localStorage after successful fetch', async () => {
    vi.mocked(myBookingsService.getMyBookings).mockResolvedValue([mockBooking]);
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(localCacheService.loadBookingsFromCache()).toEqual([mockBooking]);
  });

  it('returns fromCache=false on network fetch', async () => {
    vi.mocked(myBookingsService.getMyBookings).mockResolvedValue([mockBooking]);
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.fromCache).toBe(false);
  });

  it('falls back to localStorage on network error', async () => {
    localCacheService.saveBookingsToCache([mockBooking]);
    vi.mocked(myBookingsService.getMyBookings).mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.bookings).toEqual([mockBooking]);
  });

  it('returns fromCache=true on cache fallback', async () => {
    localCacheService.saveBookingsToCache([mockBooking]);
    vi.mocked(myBookingsService.getMyBookings).mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.fromCache).toBe(true);
  });

  it('cancel mutation optimistically removes booking', async () => {
    vi.mocked(myBookingsService.getMyBookings).mockResolvedValue([mockBooking]);
    vi.mocked(myBookingsService.cancelBooking).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.cancelMutation.mutate(1);
    });

    await waitFor(() => expect(result.current.bookings).toEqual([]));
  });

  it('cancel mutation rolls back on API failure', async () => {
    vi.mocked(myBookingsService.getMyBookings).mockResolvedValue([mockBooking]);
    vi.mocked(myBookingsService.cancelBooking).mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.cancelMutation.mutate(1);
    });

    await waitFor(() => expect(result.current.cancelMutation.isError).toBe(true));
    await waitFor(() => expect(result.current.bookings).toEqual([mockBooking]));
  });

  it('cancel mutation invalidates query on success', async () => {
    vi.mocked(myBookingsService.getMyBookings).mockResolvedValue([mockBooking]);
    vi.mocked(myBookingsService.cancelBooking).mockResolvedValue(undefined);
    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.cancelMutation.mutate(1);
    });

    await waitFor(() => expect(result.current.cancelMutation.isSuccess).toBe(true));
    expect(myBookingsService.getMyBookings).toHaveBeenCalledTimes(2);
  });
});
