import type { ShoppingList } from "../../../features/lists/listsSlice";
import "./ListTabs.css";

interface ListTabsProps {
  lists: ShoppingList[];
  activeListId?: number;
  currentUserId: number;
  onSelect: (listId: number) => void;
  onCreate: () => void;
}

// Horizontal switcher between the user's lists (scrolls sideways on small screens).
export default function ListTabs({
  lists,
  activeListId,
  currentUserId,
  onSelect,
  onCreate,
}: ListTabsProps) {
  return (
    <nav className="list-tabs" aria-label="Your shopping lists">
      {lists.map((list) => {
        const isActive = list.id === activeListId;
        const isShared = list.userId !== currentUserId;
        return (
          <button
            key={list.id}
            type="button"
            className={`list-tabs__tab${isActive ? " list-tabs__tab--active" : ""}`}
            aria-current={isActive ? "true" : undefined}
            onClick={() => onSelect(list.id)}
          >
            {list.name}
            {isShared && <span className="list-tabs__badge">Shared with you</span>}
          </button>
        );
      })}
      <button type="button" className="list-tabs__tab list-tabs__tab--new" onClick={onCreate}>
        + New list
      </button>
    </nav>
  );
}
