export function formatDueDate(date: Date | null): string {
  if (!date) return 'No due date';

  // skip the year for the current year
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

export function isOverdue(date: Date | null, completed: boolean): boolean {
  if (!date || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}
