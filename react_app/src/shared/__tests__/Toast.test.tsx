import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { ToastContainer, useToast, useToastStore } from '../components/Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('success toast appears with correct message', () => {
    render(<ToastContainer />);
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Booking confirmed');
    });

    expect(screen.getByText('Booking confirmed')).toBeInTheDocument();
  });

  it('error toast appears with error styling', () => {
    render(<ToastContainer />);
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Slot already booked');
    });

    const toast = screen.getByText('Slot already booked');
    expect(toast.className).toMatch(/error/);
  });

  it('toast auto-dismisses after 3s', () => {
    render(<ToastContainer />);
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info('Heads up');
    });
    expect(screen.getByText('Heads up')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Heads up')).not.toBeInTheDocument();
  });

  it('multiple toasts stack correctly', () => {
    render(<ToastContainer />);
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('First');
      result.current.error('Second');
    });

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
