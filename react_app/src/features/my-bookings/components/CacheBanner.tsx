import styles from './CacheBanner.module.css';

export function CacheBanner() {
  return (
    <div className={styles.banner} role="status">
      ⚠️ Showing cached data — connect to internet to refresh
    </div>
  );
}
