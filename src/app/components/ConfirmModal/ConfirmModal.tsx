import { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

// "Are you sure?" dialog used before deleting an item or a whole list.
export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={submitting}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
