import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  // Red confirm button for irreversible actions (delete, sign out).
  destructive?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
}

// Bottom-sheet confirmation, replacing Alert.alert so it matches the app's
// design on both platforms. The parent owns `visible`; this component only
// reports choices.
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = false,
  icon = 'alert-circle-outline',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      {/* Dimmed backdrop; tapping outside the sheet cancels. */}
      <Pressable className="flex-1 justify-end bg-ink/50" onPress={onCancel}>
        {/* Inner Pressable swallows taps so they don't reach the backdrop. */}
        <Pressable
          className="items-center rounded-t-[28px] bg-surface px-6 pb-9 pt-3"
          onPress={() => {}}
        >
          <View className="mb-4 h-[5px] w-11 rounded-full bg-[#D5D7E4]" />
          <View
            className={`mb-3 h-14 w-14 items-center justify-center rounded-full ${
              destructive ? 'bg-dangerSoft' : 'bg-primarySoft'
            }`}
          >
            <Ionicons name={icon} size={26} color={destructive ? colors.dangerInk : colors.primary} />
          </View>
          <Text className="font-sansXBold text-[22px] text-ink">{title}</Text>
          <Text className="mb-5 mt-2 text-center font-sans text-[15px] leading-[22px] text-muted">
            {message}
          </Text>
          <View className="w-full flex-row gap-3">
            <Pressable
              onPress={onCancel}
              className="h-[50px] flex-1 items-center justify-center rounded-2xl border-[1.5px] border-primary bg-surface active:bg-primarySoft"
            >
              <Text className="font-sansBold text-base text-primary">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className={`h-[50px] flex-1 items-center justify-center rounded-2xl ${
                destructive ? 'bg-dangerStrong' : 'bg-primary'
              } active:opacity-80`}
            >
              <Text className="font-sansBold text-base text-white">{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
