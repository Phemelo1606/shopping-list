// Each validator returns an error message, or undefined when the value is fine.

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "Include at least one letter and one number.";
  }
}

export function validateRequired(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} is required.`;
}

export function validateCellNumber(cellNumber: string): string | undefined {
  if (!cellNumber.trim()) return "Cell number is required.";
  if (!/^\+?[\d\s-]{9,15}$/.test(cellNumber.trim())) return "Enter a valid cell number.";
}

export const hasErrors = (errors: Record<string, string | undefined>): boolean =>
  Object.values(errors).some(Boolean);
