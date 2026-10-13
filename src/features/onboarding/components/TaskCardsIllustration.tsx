import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// stacked cards from plain Views, shared by Welcome and Onboarding
export function TaskCardsIllustration({ large = false }: { large?: boolean }) {
  const rows = [
    { done: true, badge: 'bg-dangerSoft', offset: 'self-start' },
    { done: false, badge: 'bg-warningSoft', offset: 'self-end' },
    { done: false, badge: 'bg-successSoft', offset: 'self-start ml-2' },
  ];
  return (
    <View className={`w-[290px] gap-4 ${large ? 'py-6' : 'py-3'}`}>
      {rows.map((row, i) => (
        <View
          key={i}
          style={CARD_SHADOW}
          className={`h-[72px] w-[236px] flex-row items-center rounded-[22px] bg-surface px-4 ${row.offset}`}
        >
          <View
            className={`h-7 w-7 items-center justify-center rounded-full ${
              row.done ? 'bg-success' : 'border-2 border-subtle'
            }`}
          >
            {row.done ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
          </View>
          <View className="ml-3 flex-1 gap-2">
            <View className="h-2.5 w-24 rounded-full bg-[#D9D5FF]" />
            <View className="h-2 w-16 rounded-full bg-[#EFEDFF]" />
          </View>
          <View className={`h-5 w-11 rounded-full ${row.badge}`} />
        </View>
      ))}
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: '#6558F5',
  shadowOpacity: 0.16,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 3,
};
