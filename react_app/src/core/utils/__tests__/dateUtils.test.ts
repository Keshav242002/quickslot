import { describe, it, expect } from 'vitest';
import {
  getNextDays,
  formatDate,
  formatDisplayDate,
  formatTime,
} from '../dateUtils';

describe('getNextDays', () => {
  it('returns correct number of dates', () => {
    expect(getNextDays(7)).toHaveLength(7);
  });

  it('first date is today', () => {
    const [first] = getNextDays(3);
    const today = new Date();
    expect(first.toDateString()).toBe(today.toDateString());
  });
});

describe('formatDate', () => {
  it('returns YYYY-MM-DD', () => {
    expect(formatDate(new Date(2026, 6, 2))).toBe('2026-07-02');
  });
});

describe('formatDisplayDate', () => {
  it('returns human-readable string', () => {
    expect(formatDisplayDate(new Date(2026, 6, 2))).toBe('Thu, 2 Jul');
  });
});

describe('formatTime', () => {
  it('converts 24h to 12h AM/PM', () => {
    expect(formatTime('09:00:00')).toBe('9:00 AM');
    expect(formatTime('15:30:00')).toBe('3:30 PM');
  });

  it('handles midnight (00:00:00)', () => {
    expect(formatTime('00:00:00')).toBe('12:00 AM');
  });

  it('handles noon (12:00:00)', () => {
    expect(formatTime('12:00:00')).toBe('12:00 PM');
  });
});
