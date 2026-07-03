import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';

export interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function ConflictModal({ isOpen, onClose, message }: ConflictModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Slot No Longer Available">
      <p>{message}</p>
      <Button variant="primary" onClick={onClose}>
        OK
      </Button>
    </Modal>
  );
}
