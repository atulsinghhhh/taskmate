import { Text, View } from 'react-native';
import { PRIORITY_CONFIG } from '../priority';
import type { TaskPriority } from '../types/task';

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, badgeClass, textClass, color } = PRIORITY_CONFIG[priority];
  return (
    <View className={`h-6 flex-row items-center self-start rounded-full px-2.5 ${badgeClass}`}>
      <View style={{ backgroundColor: color }} className="mr-1.5 h-1.5 w-1.5 rounded-full" />
      <Text className={`font-sansBold text-xs ${textClass}`}>{label}</Text>
    </View>
  );
}
