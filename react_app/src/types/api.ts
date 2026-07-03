export interface Venue {
  id: number;
  name: string;
  sport_type: string;
  location: string;
  description: string;
  image_url: string;
  price_per_hour: string;
}

export interface Slot {
  id: number;
  venue_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  updated_at?: string;
}

export interface Booking {
  id: number;
  slot: Slot;
  venue: Venue;
  booked_at: string;
}

export interface BackendUser {
  id: number;
  firebase_uid: string;
  email: string;
  display_name: string;
}

export type SlotStatus = 'available' | 'booked' | 'selected' | 'booking';

export type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening';
