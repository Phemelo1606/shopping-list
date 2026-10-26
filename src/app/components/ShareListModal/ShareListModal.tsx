import { useState } from "react";
import type { FormEvent } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import Avatar from "../Avatar/Avatar";
import { validateEmail } from "../../utils/validation";
import "./ShareListModal.css";

interface ShareListModalProps {
  listName: string;
  sharedWith: string[];
  onShare: (email: string) => Promise<boolean>; // resolves true when it worked
  onUnshare: (email: string) => Promise<void>;
  onClose: () => void;
}

// Lets the list owner give other registered users access by email.
export default function ShareListModal({
  listName,
  sharedWith,
  onShare,
  onUnshare,
  onClose,
}: ShareListModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateEmail(email);
    setError(validationError);
    if (validationError) return;

    setSubmitting(true);
    const shared = await onShare(email);
    setSubmitting(false);
    if (shared) setEmail("");
  };

  return (
    <Modal
      isOpen
      title={`Share "${listName}"`}
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <p className="share-modal-hint">
        People you share with can see this list, add items and tick them off.
      </p>

      <form className="share-modal-form" onSubmit={handleSubmit} noValidate>
        <TextInput
          label="Their email address"
          type="email"
          value={email}
          error={error}
          placeholder="friend@example.com"
          autoComplete="off"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" loading={submitting}>
          Share
        </Button>
      </form>

      <h3 className="share-modal-heading">Shared with</h3>
      {sharedWith.length === 0 ? (
        <p className="share-modal-empty">Not shared with anyone yet.</p>
      ) : (
        <ul className="share-modal-list">
          {sharedWith.map((sharedEmail) => (
            <li key={sharedEmail} className="share-modal-person">
              <Avatar name={sharedEmail} size="sm" />
              <span className="share-modal-email">{sharedEmail}</span>
              <Button variant="ghost" size="sm" onClick={() => onUnshare(sharedEmail)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
