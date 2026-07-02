import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import styles from './BottomNav.module.css';

const TABS = [
  { to: '/venues', label: 'Venues', icon: '🏟️' },
  { to: '/my-bookings', label: 'My Bookings', icon: '📋' },
];

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => clsx(styles.tab, isActive && styles.active)}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
