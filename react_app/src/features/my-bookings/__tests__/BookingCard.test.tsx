import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingCard } from '../components/BookingCard';
import type { Booking } from '@/types/api';

function makeBooking(overrides: Partial<Booking['slot']> = {}): Booking {
  return {
    id: 1,
    slot: {
      id: 1,
      venue_id: 1,
      date: '2099-01-01',
      start_time: '09:00:00',
      end_time: '10:00:00',
      is_booked: true,
      ...overrides,
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
}

describe('BookingCard', () => {
  it('renders venue name, sport, date, time, price', () => {
    render(<BookingCard booking={makeBooking()} onCancel={vi.fn()} />);

    expect(screen.getByText(/City Sports Arena/)).toBeInTheDocument();
    expect(screen.getByText('badminton')).toBeInTheDocument();
    expect(screen.getByText(/9:00 AM.*10:00 AM/)).toBeInTheDocument();
    expect(screen.getByText(/₹500/)).toBeInTheDocument();
  });

  it('Cancel button visible for future booking', () => {
    render(<BookingCard booking={makeBooking({ date: '2099-01-01' })} onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('Cancel button hidden for past booking', () => {
    render(<BookingCard booking={makeBooking({ date: '2020-01-01' })} onCancel={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('clicking Cancel calls onCancel with correct id', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<BookingCard booking={makeBooking()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledWith(1);
  });

  it('card renders correctly with slot nested object', () => {
    const booking = makeBooking();
    render(<BookingCard booking={booking} onCancel={vi.fn()} />);
    expect(screen.getByText(/📅/)).toBeInTheDocument();
  });
});
