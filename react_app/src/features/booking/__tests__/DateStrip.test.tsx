import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateStrip } from '../components/DateStrip';
import { getNextDays, formatDayShort } from '@/core/utils/dateUtils';

describe('DateStrip', () => {
  it('renders 7 date cells', () => {
    const dates = getNextDays(7);
    render(<DateStrip dates={dates} selectedDate={dates[0]} onChange={vi.fn()} />);
    expect(screen.getAllByRole('tab')).toHaveLength(7);
  });

  it('first date is today', () => {
    const dates = getNextDays(7);
    render(<DateStrip dates={dates} selectedDate={dates[0]} onChange={vi.fn()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveTextContent(formatDayShort(new Date()));
  });

  it('selected date cell has aria-selected=true', () => {
    const dates = getNextDays(7);
    render(<DateStrip dates={dates} selectedDate={dates[2]} onChange={vi.fn()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('clicking a different date calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const dates = getNextDays(7);
    render(<DateStrip dates={dates} selectedDate={dates[0]} onChange={onChange} />);

    await user.click(screen.getAllByRole('tab')[3]);

    expect(onChange).toHaveBeenCalledWith(dates[3]);
  });

  it('dates are sorted ascending', () => {
    const dates = getNextDays(7);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].getTime()).toBeGreaterThan(dates[i - 1].getTime());
    }
  });
});
