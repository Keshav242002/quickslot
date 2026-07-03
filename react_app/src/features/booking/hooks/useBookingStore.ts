import { create } from 'zustand';
import type { TimeFilter } from '@/types/api';

interface BookingStore {
  selectedSlotId: number | null;
  bookingSlotId: number | null;
  timeFilter: TimeFilter;
  selectSlot: (id: number | null) => void;
  setTimeFilter: (f: TimeFilter) => void;
  setBookingSlot: (id: number | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedSlotId: null,
  bookingSlotId: null,
  timeFilter: 'all',
  selectSlot: (id) => set({ selectedSlotId: id }),
  setTimeFilter: (f) => set({ timeFilter: f }),
  setBookingSlot: (id) => set({ bookingSlotId: id }),
  reset: () => set({ selectedSlotId: null, bookingSlotId: null }),
}));
