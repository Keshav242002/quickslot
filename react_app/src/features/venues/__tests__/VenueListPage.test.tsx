import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { VenueListPage } from '../pages/VenueListPage';
import { useVenueFilterStore } from '../hooks/useVenueFilterStore';
import type { Venue } from '@/types/api';

const useVenues = vi.fn();

vi.mock('../hooks/useVenues', () => ({
  useVenues: () => useVenues(),
}));

const venues: Venue[] = [
  {
    id: 1,
    name: 'City Sports Arena',
    sport_type: 'badminton',
    location: 'Koramangala',
    description: '',
    image_url: '',
    price_per_hour: '500.00',
  },
  {
    id: 2,
    name: 'Green Field',
    sport_type: 'football',
    location: 'Indiranagar',
    description: '',
    image_url: '',
    price_per_hour: '800.00',
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <VenueListPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useVenueFilterStore.setState({ selectedSport: 'all' });
});

describe('VenueListPage', () => {
  it('shows 3 skeleton cards while loading', () => {
    useVenues.mockReturnValue({ isLoading: true, isError: false, data: undefined });
    renderPage();

    expect(screen.getAllByTestId('venue-card-skeleton')).toHaveLength(3);
    expect(screen.queryByText('City Sports Arena')).not.toBeInTheDocument();
  });

  it('shows venue cards after data loads', () => {
    useVenues.mockReturnValue({ isLoading: false, isError: false, data: venues });
    renderPage();

    expect(screen.getByText('City Sports Arena')).toBeInTheDocument();
    expect(screen.getByText('Green Field')).toBeInTheDocument();
  });

  it('shows ErrorState with retry when query fails', () => {
    const refetch = vi.fn();
    useVenues.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('boom'),
      data: undefined,
      refetch,
    });
    renderPage();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('shows EmptyState when API returns empty array', () => {
    useVenues.mockReturnValue({ isLoading: false, isError: false, data: [] });
    renderPage();

    expect(screen.getByText(/no venues found/i)).toBeInTheDocument();
  });

  it('filter chips appear after data loads', () => {
    useVenues.mockReturnValue({ isLoading: false, isError: false, data: venues });
    renderPage();

    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /badminton/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /football/i })).toBeInTheDocument();
  });

  it('filtering by sport shows only matching venues', async () => {
    const user = userEvent.setup();
    useVenues.mockReturnValue({ isLoading: false, isError: false, data: venues });
    renderPage();

    await user.click(screen.getByRole('tab', { name: /badminton/i }));

    expect(screen.getByText('City Sports Arena')).toBeInTheDocument();
    expect(screen.queryByText('Green Field')).not.toBeInTheDocument();
  });

  it('switching back to "All" shows all venues', async () => {
    const user = userEvent.setup();
    useVenues.mockReturnValue({ isLoading: false, isError: false, data: venues });
    renderPage();

    await user.click(screen.getByRole('tab', { name: /badminton/i }));
    await user.click(screen.getByRole('tab', { name: 'All' }));

    expect(screen.getByText('City Sports Arena')).toBeInTheDocument();
    expect(screen.getByText('Green Field')).toBeInTheDocument();
  });
});
