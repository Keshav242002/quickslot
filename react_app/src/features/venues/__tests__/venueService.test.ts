import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/core/api/axiosClient', () => ({
  axiosClient: { get: vi.fn() },
}));

import { axiosClient } from '@/core/api/axiosClient';
import { getVenues } from '../services/venueService';

const mockVenue = {
  id: 1,
  name: 'City Sports Arena',
  sport_type: 'badminton',
  location: 'Koramangala, Bengaluru',
  description: 'A nice arena',
  image_url: 'https://example.com/image.jpg',
  price_per_hour: '500.00',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('venueService', () => {
  it('getVenues returns array of Venue objects on 200', async () => {
    (axiosClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockVenue] });

    const result = await getVenues();

    expect(axiosClient.get).toHaveBeenCalledWith('/venues/');
    expect(result).toEqual([mockVenue]);
  });

  it('getVenues throws ApiError on network failure', async () => {
    (axiosClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network Error'));

    await expect(getVenues()).rejects.toThrow('Network Error');
  });

  it('getVenues throws ApiError on 401', async () => {
    const error = Object.assign(new Error('Unauthorized'), {
      response: { status: 401 },
    });
    (axiosClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(getVenues()).rejects.toThrow('Unauthorized');
  });

  it('response correctly maps sport_type, image_url, price_per_hour', async () => {
    (axiosClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockVenue] });

    const [venue] = await getVenues();

    expect(venue.sport_type).toBe('badminton');
    expect(venue.image_url).toBe('https://example.com/image.jpg');
    expect(venue.price_per_hour).toBe('500.00');
  });
});
