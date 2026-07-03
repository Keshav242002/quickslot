import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VenueCard } from '../components/VenueCard';
import type { Venue } from '@/types/api';

function makeVenue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: 1,
    name: 'City Sports Arena',
    sport_type: 'badminton',
    location: 'Koramangala, Bengaluru',
    description: 'A nice arena',
    image_url: 'https://example.com/image.jpg',
    price_per_hour: '500.00',
    ...overrides,
  };
}

describe('VenueCard', () => {
  it('renders venue name, location, price', () => {
    render(<VenueCard venue={makeVenue()} onClick={vi.fn()} />);

    expect(screen.getByText('City Sports Arena')).toBeInTheDocument();
    expect(screen.getByText(/Koramangala, Bengaluru/)).toBeInTheDocument();
    expect(screen.getByText(/₹500\/hr/)).toBeInTheDocument();
  });

  it('renders correct sport emoji for badminton', () => {
    render(<VenueCard venue={makeVenue({ sport_type: 'badminton' })} onClick={vi.fn()} />);
    expect(screen.getByText(/🏸/)).toBeInTheDocument();
  });

  it('renders correct sport emoji for football', () => {
    render(<VenueCard venue={makeVenue({ sport_type: 'football' })} onClick={vi.fn()} />);
    expect(screen.getByText(/⚽/)).toBeInTheDocument();
  });

  it('renders correct sport emoji for tennis', () => {
    render(<VenueCard venue={makeVenue({ sport_type: 'tennis' })} onClick={vi.fn()} />);
    expect(screen.getByText(/🎾/)).toBeInTheDocument();
  });

  it('renders fallback emoji for unknown sport', () => {
    render(<VenueCard venue={makeVenue({ sport_type: 'chess' })} onClick={vi.fn()} />);
    expect(screen.getByText(/🏟️/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<VenueCard venue={makeVenue()} onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has correct ARIA label for screen readers', () => {
    render(<VenueCard venue={makeVenue()} onClick={vi.fn()} />);

    expect(
      screen.getByRole('button', {
        name: /City Sports Arena, badminton, Koramangala, Bengaluru, ₹500\/hr/,
      }),
    ).toBeInTheDocument();
  });
});
