export function formatDueDate(date: Date | null): string {
  if (!date) return 'No due date';

  // Leave the year out for dates in the current year: "Oct 14" is shorter
  // and easier to scan on a task card.
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
