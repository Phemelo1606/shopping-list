import { useEffect, useRef, useState } from "react";
import type { ShoppingItem } from '../../../features/lists/listsSlice';
import Chip from '../Chip/Chip';
import { formatTimeAgo } from '../../../app/utils/formatTimeAgo';
import "./ItemCard.css";


interface ItemCardProps {
  item: ShoppingItem;
  onToggleBought: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (item: ShoppingItem) => void;
}


export default function ItemCard({ item, onToggleBought, onEdit, onDelete }: ItemCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit(item);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(item);
  };

  return (
    <article className={`item-card${item.bought ? " item-card--bought" : ""}`}>
      <div className="item-card-top">
        <div className="item-card-media">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} loading="lazy" />
          ) : (
            <span className="item-card-fallback" aria-hidden="true">
              {item.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <span className="item-card-category-label">{item.category}</span>

        <div className="item-card-actions">
          <button
            type="button"
            role="checkbox"
            aria-checked={item.bought}
            aria-label={`Mark ${item.name} as ${item.bought ? "not bought" : "bought"}`}
            className="item-card-check"
            onClick={() => onToggleBought(item)}
          >
            {item.bought && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m5 12 5 5L20 7" />
              </svg>
            )}
          </button>

          <div className="item-card-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="item-card-menu-button"
              aria-label={`More actions for ${item.name}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              ···
            </button>
            {menuOpen && (
              <div className="item-card-menu" role="menu">
                <button type="button" role="menuitem" onClick={handleEdit}>
                  Edit
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="item-card-menu-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="item-card-body">
        <div className="item-card-title-row">
          <h3 className="item-card-name">{item.name}</h3>
          <Chip variant="quantity" label={String(item.quantity)} />
        </div>
        {item.notes && <p className="item-card-notes">{item.notes}</p>}
      </div>

      <div className="item-card-footer">
        <Chip label={item.category} />
        <span className="item-card-time">Added {formatTimeAgo(item.createdAt)}</span>
      </div>
    </article>
  );
}