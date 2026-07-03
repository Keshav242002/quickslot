import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/core/api/axiosClient', () => ({
  axiosClient: { get: vi.fn(), delete: vi.fn() },
}));

import { axiosClient } from '@/core/api/axiosClient';
import { getMyBookings, cancelBooking } from '../services/myBookingsService';

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('myBookingsService', () => {
  it('getMyBookings returns Booking array on 200', async () => {
    (axiosClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockBooking] });

    const result = await getMyBookings();

    expect(axiosClient.get).toHaveBeenCalledWith('/me/bookings/');
    expect(result).toEqual([mockBooking]);
  });

  it('getMyBookings throws on 401', async () => {
    const error = Object.assign(new Error('Unauthorized'), { response: { status: 401 } });
    (axiosClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(getMyBookings()).rejects.toThrow('Unauthorized');
  });

  it('cancelBooking calls DELETE /bookings/{id}/', async () => {
    (axiosClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

    await cancelBooking(1);

    expect(axiosClient.delete).toHaveBeenCalledWith('/bookings/1/');
  });

  it('cancelBooking throws on 403 (not owner)', async () => {
    const error = Object.assign(new Error('Forbidden'), { response: { status: 403 } });
    (axiosClient.delete as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(cancelBooking(1)).rejects.toThrow('Forbidden');
  });

  it('cancelBooking throws on 404 (not found)', async () => {
    const error = Object.assign(new Error('Not Found'), { response: { status: 404 } });
    (axiosClient.delete as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(cancelBooking(1)).rejects.toThrow('Not Found');
  });
});
