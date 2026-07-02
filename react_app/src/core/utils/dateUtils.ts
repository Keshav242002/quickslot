import { addDays, format } from 'date-fns';

export function getNextDays(n: number): Date[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => addDays(today, i));
}

export function formatDate(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export function formatDisplayDate(d: Date): string {
  return format(d, 'EEE, d MMM');
}

export function formatDayName(d: Date): string {
  return format(d, 'EEE').toUpperCase();
}

export function formatDayShort(d: Date): string {
  return format(d, 'd');
}

export function formatTime(t: string): string {
  const [hoursStr, minutesStr] = t.split(':');
  const hours = Number(hoursStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutesStr.padStart(2, '0')} ${period}`;
}
