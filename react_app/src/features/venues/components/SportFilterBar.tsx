import clsx from 'clsx';
import { getSportEmoji } from '../utils/sportIcons';
import styles from './SportFilterBar.module.css';

export interface SportFilterBarProps {
  sports: string[];
  selected: string;
  onChange: (sport: string) => void;
}

export function SportFilterBar({ sports, selected, onChange }: SportFilterBarProps) {
  return (
    <div className={styles.bar} role="tablist" aria-label="Filter venues by sport">
      <button
        type="button"
        role="tab"
        aria-selected={selected === 'all'}
        className={clsx(styles.chip, selected === 'all' && styles.active)}
        onClick={() => onChange('all')}
      >
        All
      </button>
      {sports.map((sport) => (
        <button
          key={sport}
          type="button"
          role="tab"
          aria-selected={selected === sport}
          className={clsx(styles.chip, selected === sport && styles.active)}
          onClick={() => onChange(sport)}
        >
          {getSportEmoji(sport)} {sport}
        </button>
      ))}
    </div>
  );
}
