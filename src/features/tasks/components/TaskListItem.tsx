import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusCheckbox } from '@/components/StatusCheckbox';
import { colors } from '@/theme/colors';
import { formatDueDate, isOverdue } from '@/utils/formatDate';
import type { Task } from '../types/task';
import { PriorityBadge } from './PriorityBadge';

interface TaskListItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function TaskListItemBase({ task, onToggle, onEdit, onDelete }: TaskListItemProps) {
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <View
      style={CARD_SHADOW}
      className={`mb-2.5 flex-row items-start rounded-[18px] border border-[#E9EAF3] py-2.5 pl-2 pr-2 ${
        task.completed ? 'bg-field' : 'bg-surface'
      }`}
    >
      <StatusCheckbox checked={task.completed} onToggle={() => onToggle(task)} />

      <Pressable className="flex-1 py-1.5 pl-1" onPress={() => onEdit(task)}>
        <Text
          numberOfLines={1}
          className={`font-sansBold text-[15px] ${
            task.completed ? 'text-muted line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text numberOfLines={1} className="mt-0.5 font-sans text-[13px] text-muted">
            {task.description}
          </Text>
        ) : null}
        <View className="mt-2 flex-row flex-wrap items-center gap-2">
          <View className="flex-row items-center">
            <Ionicons
              name="calendar-outline"
              size={14}
              color={overdue ? colors.dangerInk : colors.muted}
            />
            <Text
              className={`ml-1.5 font-sansSemi text-xs ${overdue ? 'text-dangerInk' : 'text-muted'}`}
            >
              {formatDueDate(task.dueDate)}
            </Text>
          </View>
          <PriorityBadge priority={task.priority} />
        </View>
      </Pressable>

      <View className="flex-row">
        <Pressable
          onPress={() => onEdit(task)}
          accessibilityLabel={`Edit ${task.title}`}
          className="h-11 w-10 items-center justify-center"
        >
          <Ionicons name="create-outline" size={20} color={colors.muted} />
        </Pressable>
        <Pressable
          onPress={() => onDelete(task)}
          accessibilityLabel={`Delete ${task.title}`}
          className="h-11 w-10 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={20} color={colors.dangerInk} />
        </Pressable>
      </View>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: colors.ink,
  shadowOpacity: 0.06,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
};

// memo so rows don't re-render while typing in search
export const TaskListItem = memo(TaskListItemBase);
