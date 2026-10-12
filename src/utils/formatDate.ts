export function formatDueDate(date: Date | null): string {
  if (!date) return 'No due date';

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isOverdue(date: Date | null, completed: boolean): boolean {
  if (!date || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Parses a "YYYY-MM-DD" string into a Date, or null if it isn't one.
// Rejects impossible dates like "2024-02-31" instead of letting JS silently
// roll them over into March 2nd.
export function parseDateInput(text: string): Date | null {
  const trimmed = text.trim();
  if (!DATE_INPUT_REGEX.test(trimmed)) return null;

  const [year, month, day] = trimmed.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function toDateInputValue(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
