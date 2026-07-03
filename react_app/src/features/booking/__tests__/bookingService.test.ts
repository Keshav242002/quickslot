import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/core/api/axiosClient', () => ({
  axiosClient: { post: vi.fn() },
}));

import { axiosClient } from '@/core/api/axiosClient';
import { createBooking } from '../services/bookingService';
import { SlotAlreadyBookedError } from '@/core/utils/errorUtils';

const mockBooking = {
  id: 1,
  slot: {
    id: 5,
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

describe('bookingService', () => {
  it('createBooking posts { slot_id } and returns Booking on 201', async () => {
    (axiosClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockBooking });

    const result = await createBooking(5);

    expect(axiosClient.post).toHaveBeenCalledWith('/bookings/', { slot_id: 5 });
    expect(result).toEqual(mockBooking);
  });

  it('createBooking throws SlotAlreadyBookedError on 409', async () => {
    const error = Object.assign(new Error('Conflict'), {
      isAxiosError: true,
      response: { status: 409 },
    });
    (axiosClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(createBooking(5)).rejects.toBeInstanceOf(SlotAlreadyBookedError);
  });

  it('createBooking throws on 401 (unauthenticated)', async () => {
    const error = Object.assign(new Error('Unauthorized'), {
      isAxiosError: true,
      response: { status: 401 },
    });
    (axiosClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(createBooking(5)).rejects.toThrow('Unauthorized');
  });

  it('createBooking throws generic error on 500', async () => {
    const error = Object.assign(new Error('Server Error'), {
      isAxiosError: true,
      response: { status: 500 },
    });
    (axiosClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(createBooking(5)).rejects.toThrow('Server Error');
  });
});
