import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingModal } from '../components/BookingModal';
import type { Slot, Venue } from '@/types/api';

const venue: Venue = {
  id: 1,
  name: 'City Sports Arena',
  sport_type: 'badminton',
  location: 'Koramangala',
  description: '',
  image_url: '',
  price_per_hour: '500.00',
};

const slot: Slot = {
  id: 1,
  venue_id: 1,
  date: '2026-07-08',
  start_time: '09:00:00',
  end_time: '10:00:00',
  is_booked: false,
};

describe('BookingModal', () => {
  it('renders venue name, date, time, price', () => {
    render(
      <BookingModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} slot={slot} venue={venue} loading={false} />,
    );

    expect(screen.getByText(/City Sports Arena/)).toBeInTheDocument();
    expect(screen.getByText(/9:00 AM.*10:00 AM/)).toBeInTheDocument();
    expect(screen.getByText(/₹500/)).toBeInTheDocument();
  });

  it('Confirm button shows spinner when loading=true', () => {
    render(
      <BookingModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} slot={slot} venue={venue} loading />,
    );
    expect(screen.getByRole('button', { name: /confirm/i })).toHaveAttribute('aria-busy', 'true');
  });

  it('Cancel button calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BookingModal isOpen onClose={onClose} onConfirm={vi.fn()} slot={slot} venue={venue} loading={false} />,
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('Confirm button calls onConfirm', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <BookingModal isOpen onClose={vi.fn()} onConfirm={onConfirm} slot={slot} venue={venue} loading={false} />,
    );

    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(onConfirm).toHaveBeenCalled();
  });

  it('Escape key calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BookingModal isOpen onClose={onClose} onConfirm={vi.fn()} slot={slot} venue={venue} loading={false} />,
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });
});
