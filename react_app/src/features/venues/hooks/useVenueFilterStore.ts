import { create } from 'zustand';

interface VenueFilterState {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
}

export const useVenueFilterStore = create<VenueFilterState>((set) => ({
  selectedSport: 'all',
  setSelectedSport: (sport) => set({ selectedSport: sport }),
}));
