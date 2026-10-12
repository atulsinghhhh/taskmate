import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

// Round completion checkbox. It's "controlled": it doesn't remember its own
// state, the parent passes `checked` and reacts to `onToggle`. Here that means
// the task's `completed` flag in the store is the single truth.
export function StatusCheckbox({ checked, onToggle }: StatusCheckboxProps) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={checked ? 'Mark as pending' : 'Mark as completed'}
      className="h-11 w-11 items-center justify-center"
    >
      <View
        className={`h-[26px] w-[26px] items-center justify-center rounded-full border-2 ${
          checked ? 'border-success bg-success' : 'border-subtle bg-surface'
        }`}
      >
        {checked ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
      </View>
    </Pressable>
  );
}
