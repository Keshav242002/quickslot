import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import styles from '../pages/MyBookingsPage.module.css';

export interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function CancelConfirmModal({ isOpen, onClose, onConfirm, loading }: CancelConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Booking?">
      <p>This action cannot be undone. The slot will become available for others.</p>
      <div className={styles.modalActions}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Keep Booking
        </Button>
        <Button variant="primary" onClick={onConfirm} loading={loading}>
          Yes, Cancel
        </Button>
      </div>
    </Modal>
  );
}
