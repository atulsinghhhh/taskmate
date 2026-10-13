import { colors } from '@/theme/colors';
import type { TaskPriority } from './types/task';

interface PriorityStyle {
  label: string;
  badgeClass: string; // pill background in PriorityBadge
  textClass: string; // pill / selected option text color
  selectedClass: string; // selected option in the task form's PrioritySelector
  color: string; // raw hex of the dot, which can't take a className
}

// class names must be written in full, tailwind can't see `bg-${color}Soft`
export const PRIORITY_CONFIG: Record<TaskPriority, PriorityStyle> = {
  low: {
    label: 'Low',
    badgeClass: 'bg-successSoft',
    textClass: 'text-successInk',
    selectedClass: 'border-success bg-successSoft',
    color: colors.success,
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-warningSoft',
    textClass: 'text-warningInk',
    selectedClass: 'border-warning bg-warningSoft',
    color: colors.warning,
  },
  high: {
    label: 'High',
    badgeClass: 'bg-dangerSoft',
    textClass: 'text-dangerInk',
    selectedClass: 'border-danger bg-dangerSoft',
    color: colors.danger,
  },
};

export const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
