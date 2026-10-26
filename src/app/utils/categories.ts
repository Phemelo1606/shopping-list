export const CATEGORIES = [
  "Produce",
  "Dairy",
  "Bakery",
  "Meat & Fish",
  "Pantry",
  "Frozen",
  "Drinks",
  "Household",
  "Personal care",
  "Other",
] as const;

export const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));
