import { useState } from "react";
import type { FormEvent } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import SelectInput from "../SelectInput/SelectInput";
import ImagePicker from "../ImagePicker/ImagePicker";
import type { ShoppingItem } from "../../../features/lists/listsSlice";
import { CATEGORY_OPTIONS } from "../../utils/categories";
import { validateRequired } from "../../utils/validation";

export interface ItemFormValues {
  name: string;
  quantity: number;
  category: string;
  notes: string;
  imageUrl?: string;
}

interface ItemFormModalProps {
  item?: ShoppingItem; // present when editing
  onSubmit: (values: ItemFormValues) => Promise<void>;
  onClose: () => void;
}

// One form for both "Add item" and "Edit item".
export default function ItemFormModal({ item, onSubmit, onClose }: ItemFormModalProps) {
  const isEditing = Boolean(item);
  const [name, setName] = useState(item?.name ?? "");
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1));
  const [category, setCategory] = useState(item?.category ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const parsedQuantity = Number(quantity);
    const nextErrors = {
      name: validateRequired(name, "Item name"),
      quantity:
        Number.isInteger(parsedQuantity) && parsedQuantity >= 1
          ? undefined
          : "Enter a whole number of 1 or more.",
      category: category ? undefined : "Choose a category.",
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({ name, quantity: Number(quantity), category, notes, imageUrl });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      title={isEditing ? "Edit item" : "Add item"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="item-form" loading={submitting}>
            {isEditing ? "Save changes" : "Add item"}
          </Button>
        </>
      }
    >
      <form id="item-form" className="form-stack" onSubmit={handleSubmit} noValidate>
        <TextInput
          label="Name"
          value={name}
          error={errors.name}
          placeholder="e.g. Full cream milk"
          onChange={(event) => setName(event.target.value)}
        />
        <div className="form-row">
          <TextInput
            label="Quantity"
            type="number"
            value={quantity}
            error={errors.quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          <SelectInput
            label="Category"
            value={category}
            options={CATEGORY_OPTIONS}
            placeholder="Choose…"
            error={errors.category}
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>
        <TextInput
          label="Notes (optional)"
          multiline
          rows={3}
          value={notes}
          placeholder="Brand, size, where to find it…"
          onChange={(event) => setNotes(event.target.value)}
        />
        <ImagePicker value={imageUrl} onChange={setImageUrl} />
      </form>
    </Modal>
  );
}
