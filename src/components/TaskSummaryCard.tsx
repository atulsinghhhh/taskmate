import { Text, View } from 'react-native';

interface TaskSummaryCardProps {
  label: string;
  value: number;
  // `primary` = solid purple card (the "Total" tile on the task list).
  tone?: 'primary' | 'plain';
  // Tailwind text color class for the number, e.g. "text-successInk".
  valueClass?: string;
}

export function TaskSummaryCard({
  label,
  value,
  tone = 'plain',
  valueClass = 'text-ink',
}: TaskSummaryCardProps) {
  const primary = tone === 'primary';
  return (
    <View
      className={`flex-1 rounded-2xl px-3.5 py-3 ${
        primary ? 'bg-primary' : 'border border-cardBorder bg-field'
      }`}
    >
      <Text className={`font-sansXBold text-2xl ${primary ? 'text-white' : valueClass}`}>{value}</Text>
      <Text className={`font-sansBold text-xs ${primary ? 'text-[#E8E6FF]' : 'text-muted'}`}>{label}</Text>
    </View>
  );
}
