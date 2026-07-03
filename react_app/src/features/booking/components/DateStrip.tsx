import clsx from 'clsx';
import { formatDate, formatDayName, formatDayShort } from '@/core/utils/dateUtils';
import styles from './DateStrip.module.css';

export interface DateStripProps {
  dates: Date[];
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function DateStrip({ dates, selectedDate, onChange }: DateStripProps) {
  const selectedKey = formatDate(selectedDate);

  return (
    <div className={styles.strip} role="tablist" aria-label="Select a date">
      {dates.map((date) => {
        const key = formatDate(date);
        const isActive = key === selectedKey;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={clsx(styles.cell, isActive && styles.active)}
            onClick={() => onChange(date)}
          >
            <span className={styles.day}>{formatDayName(date)}</span>
            <span className={styles.date}>{formatDayShort(date)}</span>
          </button>
        );
      })}
    </div>
  );
}
