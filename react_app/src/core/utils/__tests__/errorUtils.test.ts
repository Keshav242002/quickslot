import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { parseApiError } from '../errorUtils';

function makeAxiosError(status: number, data?: unknown): AxiosError {
  const error = new AxiosError(
    'Request failed',
    String(status),
    undefined,
    undefined,
    {
      status,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data,
    },
  );
  return error;
}

describe('parseApiError', () => {
  it('returns field message for 400 validation error', () => {
    const err = makeAxiosError(400, { slot_id: ['This field is required.'] });
    expect(parseApiError(err)).toBe('This field is required.');
  });

  it('returns "Slot already booked" for 409', () => {
    const err = makeAxiosError(409);
    expect(parseApiError(err)).toBe('Slot already booked');
  });

  it('returns "Unauthorized" for 401', () => {
    const err = makeAxiosError(401);
    expect(parseApiError(err)).toBe('Unauthorized');
  });

  it('returns "Not found" for 404', () => {
    const err = makeAxiosError(404);
    expect(parseApiError(err)).toBe('Not found');
  });

  it('returns generic message for unknown error', () => {
    const err = makeAxiosError(500);
    expect(parseApiError(err)).toBe('Something went wrong. Please try again.');
  });

  it('handles non-Axios error (plain Error object)', () => {
    expect(parseApiError(new Error('boom'))).toBe('boom');
  });
});
