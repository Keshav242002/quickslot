import { create } from 'zustand';
import clsx from 'clsx';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (message: string, variant: ToastVariant) => void;
  dismiss: (id: number) => void;
}

let nextId = 0;
const AUTO_DISMISS_MS = 3000;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, variant) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, AUTO_DISMISS_MS);
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    success: (message: string) => push(message, 'success'),
    error: (message: string) => push(message, 'error'),
    info: (message: string) => push(message, 'info'),
  };
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(styles.toast, styles[toast.variant])}
          onClick={() => dismiss(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
