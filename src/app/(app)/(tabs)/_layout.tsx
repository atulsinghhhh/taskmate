import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/theme/colors';

// Tab icon sitting in a soft lavender pill when active.
function TabIcon({
  name,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  return (
    <View
      className={`h-8 w-[60px] items-center justify-center rounded-2xl ${
        focused ? 'bg-primarySoft' : ''
      }`}
    >
      <Ionicons name={name} size={22} color={focused ? colors.primary : colors.muted} />
    </View>
  );
}

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      className={`text-xs ${focused ? 'font-sansXBold text-primary' : 'font-sansSemi text-muted'}`}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 84,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
        },
        tabBarItemStyle: { gap: 3 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // TaskListScreen draws its own header ("My Tasks", avatar) and its
          // own FAB for creating a task.
          tabBarLabel: ({ focused }) => <TabLabel label="Tasks" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'checkbox' : 'checkbox-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
