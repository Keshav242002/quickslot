import { isAxiosError } from 'axios';

export class SlotAlreadyBookedError extends Error {
  constructor(message = 'This slot is already booked') {
    super(message);
    this.name = 'SlotAlreadyBookedError';
  }
}

export function parseApiError(err: unknown): string {
  if (isAxiosError(err)) {
    const status = err.response?.status;

    if (status === 400) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const firstField = Object.values(data as Record<string, unknown>)[0];
        if (Array.isArray(firstField) && typeof firstField[0] === 'string') {
          return firstField[0];
        }
        if (typeof firstField === 'string') {
          return firstField;
        }
      }
      return 'Invalid request';
    }

    if (status === 401) return 'Unauthorized';
    if (status === 404) return 'Not found';
    if (status === 409) return 'Slot already booked';

    return 'Something went wrong. Please try again.';
  }

  if (err instanceof Error) {
    return err.message;
  }

  return 'Something went wrong. Please try again.';
}
