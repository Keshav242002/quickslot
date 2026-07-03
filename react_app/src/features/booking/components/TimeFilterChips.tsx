import clsx from 'clsx';
import type { TimeFilter } from '@/types/api';
import styles from './TimeFilterChips.module.css';

export interface TimeFilterChipsProps {
  selected: TimeFilter;
  onChange: (f: TimeFilter) => void;
}

const FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

export function TimeFilterChips({ selected, onChange }: TimeFilterChipsProps) {
  return (
    <div className={styles.bar} role="tablist" aria-label="Filter slots by time of day">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          role="tab"
          aria-selected={selected === f.value}
          className={clsx(styles.chip, selected === f.value && styles.active)}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export function matchesTimeFilter(startTime: string, filter: TimeFilter): boolean {
  if (filter === 'all') return true;
  const startHour = Number(startTime.split(':')[0]);
  if (filter === 'morning') return startHour < 12;
  if (filter === 'afternoon') return startHour >= 12 && startHour < 18;
  return startHour >= 18;
}
