import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useSlots } from '../hooks/useSlots';
import * as slotService from '../services/slotService';

vi.mock('../services/slotService');

const mockSlots = [
  { id: 1, venue_id: 1, date: '2026-07-03', start_time: '09:00:00', end_time: '10:00:00', is_booked: false },
];

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useSlots', () => {
  it('starts in loading state', () => {
    vi.mocked(slotService.getSlots).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useSlots(1, '2026-07-03'), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('transitions to success with slot data', async () => {
    vi.mocked(slotService.getSlots).mockResolvedValue(mockSlots);
    const { result } = renderHook(() => useSlots(1, '2026-07-03'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSlots);
  });

  it('transitions to error state on network failure', async () => {
    vi.mocked(slotService.getSlots).mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useSlots(1, '2026-07-03'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('re-fetches when date changes (queryKey changes)', async () => {
    vi.mocked(slotService.getSlots).mockResolvedValue(mockSlots);
    const { rerender } = renderHook(({ date }) => useSlots(1, date), {
      wrapper,
      initialProps: { date: '2026-07-03' },
    });

    await waitFor(() => expect(slotService.getSlots).toHaveBeenCalledWith(1, '2026-07-03'));

    rerender({ date: '2026-07-04' });

    await waitFor(() => expect(slotService.getSlots).toHaveBeenCalledWith(1, '2026-07-04'));
  });
});
