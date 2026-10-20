import "./Chip.css";

interface ChipProps {
  label: string;
  variant?: "category" | "quantity";
}

// category = white pill (e.g. "Dairy"), quantity = soft mono badge (e.g. "2 L")
export default function Chip({ label, variant = "category" }: ChipProps) {
  return <span className={`chip chip--${variant}`}>{label}</span>;
}
