import { useId, useRef, useState } from "react";
import FormField from "../FormField/FormField";
import Button from "../Button/Button";
import { fileToResizedDataUrl } from "../../utils/imageToDataUrl";
import "./ImagePicker.css";

interface ImagePickerProps {
  value?: string; // data URL or image address
  onChange: (imageUrl: string | undefined) => void;
  label?: string;
}

// Choose an item photo from the device, preview it, or remove it.
export default function ImagePicker({ value, onChange, label = "Item image" }: ImagePickerProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      onChange(await fileToResizedDataUrl(file));
      setError(undefined);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't use that image.");
    }
  };

  return (
    <FormField htmlFor={id} label={label} error={error}>
      <div className="image-picker">
        <div className="image-picker-preview">
          {value ? <img src={value} alt="Selected item" /> : <span aria-hidden="true">+</span>}
        </div>
        <div className="image-picker-actions">
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            {value ? "Change image" : "Upload image"}
          </Button>
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange(undefined)}>
              Remove
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="image-picker-input"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = ""; // allow picking the same file again
          }}
        />
      </div>
    </FormField>
  );
}
