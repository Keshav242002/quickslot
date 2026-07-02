export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://quickslot-api-7p9g.onrender.com/api';

export const API_ROUTES = {
  authSync: '/auth/sync/',
  venues: '/venues/',
  venueSlots: (venueId: number) => `/venues/${venueId}/slots/`,
  venueSlotsPoll: (venueId: number) => `/venues/${venueId}/slots/poll/`,
  bookings: '/bookings/',
  booking: (id: number) => `/bookings/${id}/`,
  myBookings: '/me/bookings/',
  health: '/health/',
};
