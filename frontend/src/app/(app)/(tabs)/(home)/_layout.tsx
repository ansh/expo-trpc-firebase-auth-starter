import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import colors from 'tailwindcss/colors';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          title: 'Home',
          headerRight: () => (
            <Link href="/profile" asChild>
              <Ionicons
                name="ios-person-circle"
                size={32}
                color={colors.blue[500]}
              />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{ presentation: 'modal', title: 'Profile' }}
      />
    </Stack>
  );
}
