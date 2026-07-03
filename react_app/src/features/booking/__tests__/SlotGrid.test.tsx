import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SlotGrid } from '../components/SlotGrid';
import type { Slot } from '@/types/api';

const slots: Slot[] = [
  { id: 1, venue_id: 1, date: '2026-07-03', start_time: '09:00:00', end_time: '10:00:00', is_booked: false },
  { id: 2, venue_id: 1, date: '2026-07-03', start_time: '10:00:00', end_time: '11:00:00', is_booked: true },
  { id: 3, venue_id: 1, date: '2026-07-03', start_time: '11:00:00', end_time: '12:00:00', is_booked: false },
];

describe('SlotGrid', () => {
  it('renders correct number of SlotTile components', () => {
    render(<SlotGrid slots={slots} selectedSlotId={null} bookingSlotId={null} onSlotTap={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('booked slot has aria-disabled', () => {
    render(<SlotGrid slots={slots} selectedSlotId={null} bookingSlotId={null} onSlotTap={vi.fn()} />);
    const bookedTile = screen.getByText(/10:00 AM.*11:00 AM/);
    expect(bookedTile).toHaveAttribute('aria-disabled', 'true');
  });

  it('selected slot has aria-pressed=true', () => {
    render(<SlotGrid slots={slots} selectedSlotId={1} bookingSlotId={null} onSlotTap={vi.fn()} />);
    const selectedTile = screen.getByText(/9:00 AM.*10:00 AM/);
    expect(selectedTile).toHaveAttribute('aria-pressed', 'true');
  });

  it('available slot has aria-pressed=false', () => {
    render(<SlotGrid slots={slots} selectedSlotId={null} bookingSlotId={null} onSlotTap={vi.fn()} />);
    const availableTile = screen.getByText(/9:00 AM.*10:00 AM/);
    expect(availableTile).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking available slot calls onSlotTap', async () => {
    const user = userEvent.setup();
    const onSlotTap = vi.fn();
    render(<SlotGrid slots={slots} selectedSlotId={null} bookingSlotId={null} onSlotTap={onSlotTap} />);

    await user.click(screen.getByText(/9:00 AM.*10:00 AM/));

    expect(onSlotTap).toHaveBeenCalledWith(slots[0]);
  });

  it('clicking booked slot does NOT call onSlotTap', async () => {
    const user = userEvent.setup();
    const onSlotTap = vi.fn();
    render(<SlotGrid slots={slots} selectedSlotId={null} bookingSlotId={null} onSlotTap={onSlotTap} />);

    await user.click(screen.getByText(/10:00 AM.*11:00 AM/));

    expect(onSlotTap).not.toHaveBeenCalled();
  });

  it('renders booking spinner on bookingSlotId slot', () => {
    render(<SlotGrid slots={slots} selectedSlotId={null} bookingSlotId={3} onSlotTap={vi.fn()} />);
    const bookingTile = screen.getByText(/11:00 AM.*12:00 PM/);
    expect(bookingTile.querySelector('span')).toBeInTheDocument();
  });
});
