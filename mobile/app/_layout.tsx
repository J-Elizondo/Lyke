import "../global.css";
import '@/src/locales/i18n';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuth } from "@/src/hooks/useAuth";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Handle Font Errors
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Handle Hiding Splash Screen
  useEffect(() => {
    if (fontsLoaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoading]);

  // Handle Protected Routing
  useEffect(() => {
    if (authLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, authLoading, segments, fontsLoaded]);

  // Prevent rendering the navigation tree until fonts are ready
  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}