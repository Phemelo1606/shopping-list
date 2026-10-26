import type { ShoppingItem } from "../../features/lists/listsSlice";

// The values allowed in the ?sort= part of the URL.
export const SORT_KEYS = ["date", "name", "category"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date", label: "Date added (newest)" },
  { value: "name", label: "Name (A–Z)" },
  { value: "category", label: "Category (A–Z)" },
];

export const isSortKey = (value: string | null): value is SortKey =>
  SORT_KEYS.includes(value as SortKey);

const compareText = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

const comparers: Record<SortKey, (a: ShoppingItem, b: ShoppingItem) => number> = {
  name: (a, b) => compareText(a.name, b.name),
  category: (a, b) => compareText(a.category, b.category) || compareText(a.name, b.name),
  date: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
};

interface ViewOptions {
  query: string;
  category: string; // "all" or a category name
  sort: SortKey;
}

// Applies the name search, category filter and sort order chosen in the URL.
export function filterAndSortItems(items: ShoppingItem[], { query, category, sort }: ViewOptions) {
  const search = query.trim().toLowerCase();
  return items
    .filter((item) => item.name.toLowerCase().includes(search))
    .filter((item) => category === "all" || item.category === category)
    .sort(comparers[sort]);
}
