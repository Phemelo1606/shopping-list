import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search your list…",
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <svg
        className="search-bar-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        className="search-bar-input"
        value={value}
        placeholder={placeholder}
        aria-label="Search items by name"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
