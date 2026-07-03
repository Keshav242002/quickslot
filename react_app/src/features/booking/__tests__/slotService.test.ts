import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/core/api/axiosClient', () => ({
  axiosClient: { get: vi.fn() },
}));

import { axiosClient } from '@/core/api/axiosClient';
import { getSlots, getSlotsDelta } from '../services/slotService';

const mockSlot = {
  id: 1,
  venue_id: 1,
  date: '2026-07-03',
  start_time: '09:00:00',
  end_time: '10:00:00',
  is_booked: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('slotService', () => {
  it('getSlots returns array of Slot on 200', async () => {
    (axiosClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockSlot] });

    const result = await getSlots(1, '2026-07-03');

    expect(axiosClient.get).toHaveBeenCalledWith('/venues/1/slots/', {
      params: { date: '2026-07-03' },
    });
    expect(result).toEqual([mockSlot]);
  });

  it('getSlots throws on 400 (missing date param)', async () => {
    const error = Object.assign(new Error('Bad Request'), { response: { status: 400 } });
    (axiosClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(getSlots(1, '')).rejects.toThrow('Bad Request');
  });

  it('getSlots throws on 404 (venue not found)', async () => {
    const error = Object.assign(new Error('Not Found'), { response: { status: 404 } });
    (axiosClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(getSlots(999, '2026-07-03')).rejects.toThrow('Not Found');
  });

  it('getSlotsDelta calls poll endpoint with since param', async () => {
    (axiosClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockSlot] });

    const result = await getSlotsDelta(1, '2026-07-03', '2026-07-03T09:00:00Z');

    expect(axiosClient.get).toHaveBeenCalledWith('/venues/1/slots/poll/', {
      params: { date: '2026-07-03', since: '2026-07-03T09:00:00Z' },
    });
    expect(result).toEqual([mockSlot]);
  });

  it('getSlotsDelta returns empty array when no changes since timestamp', async () => {
    (axiosClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

    const result = await getSlotsDelta(1, '2026-07-03', '2026-07-03T09:00:00Z');

    expect(result).toEqual([]);
  });
});
