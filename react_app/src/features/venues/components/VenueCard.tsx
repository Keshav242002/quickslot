import { useState } from 'react';
import type { Venue } from '@/types/api';
import { getSportEmoji } from '../utils/sportIcons';
import styles from './VenueCard.module.css';

export interface VenueCardProps {
  venue: Venue;
  onClick: () => void;
}

export function VenueCard({ venue, onClick }: VenueCardProps) {
  const [imageError, setImageError] = useState(false);
  const emoji = getSportEmoji(venue.sport_type);
  const price = parseFloat(venue.price_per_hour);

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={`${venue.name}, ${venue.sport_type}, ${venue.location}, ₹${price}/hr`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.imageWrapper}>
        {imageError || !venue.image_url ? (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <span className={styles.placeholderEmoji}>{emoji}</span>
          </div>
        ) : (
          <img
            src={venue.image_url}
            alt=""
            loading="lazy"
            className={styles.image}
            onError={() => setImageError(true)}
          />
        )}
        <span className={styles.sportBadge}>
          {emoji} {venue.sport_type}
        </span>
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{venue.name}</p>
        <p className={styles.location}>📍 {venue.location}</p>
        <p className={styles.price}>₹{price}/hr</p>
      </div>
    </div>
  );
}
