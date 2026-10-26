import { useState } from "react";
import type { FormEvent } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import { validateRequired } from "../../utils/validation";

interface ListFormModalProps {
  initialName?: string; // present when renaming
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}

// Creates a new list, or renames an existing one when initialName is given.
export default function ListFormModal({ initialName = "", onSubmit, onClose }: ListFormModalProps) {
  const isEditing = initialName !== "";
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateRequired(name, "List name");
    setError(validationError);
    if (validationError) return;

    setSubmitting(true);
    try {
      await onSubmit(name);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      title={isEditing ? "Rename list" : "New list"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="list-form" loading={submitting}>
            {isEditing ? "Save" : "Create list"}
          </Button>
        </>
      }
    >
      <form id="list-form" className="form-stack" onSubmit={handleSubmit} noValidate>
        <TextInput
          label="List name"
          value={name}
          error={error}
          placeholder="e.g. Weekly groceries"
          onChange={(event) => setName(event.target.value)}
        />
      </form>
    </Modal>
  );
}
