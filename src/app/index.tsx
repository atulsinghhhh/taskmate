import { StyleSheet, Text, View } from 'react-native';

// Temporary placeholder screen for Phase 1.
// In Phase 3 this will be replaced by real auth/task routing logic.
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      <Text style={styles.subtitle}>Phase 1 scaffold is working ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
});
