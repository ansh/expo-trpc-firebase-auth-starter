import { Redirect, SplashScreen, Stack } from 'expo-router';

import { useAuth } from '@/lib/auth/AuthContext';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return SplashScreen.preventAutoHideAsync();
  } else {
    SplashScreen.hideAsync();
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/signin" />;
  }

  // TODO: if user exists, but onboarding is not complete, redirect to onboarding
  // if (!user.onboardingComplete) {
  //   return <Redirect href="/onboarding" />;
  // }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="group"
        options={{
          headerShown: true,
          title: 'Group',
          headerBackVisible: true,
          // fullScreenGestureEnabled: true,
        }}
      />
    </Stack>
  );
}
