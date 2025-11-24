import { Stack, router, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

function AuthGuardLayout() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments.length === 0 || segments[0] === 'register';

    if (token && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!token && !inAuthGroup) {
      router.replace('/');
    }
  }, [token, isLoading, segments]);
  if (isLoading) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="list/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

const RootLayout = () => {
  return(
    <AuthProvider>
        <AuthGuardLayout />
        <StatusBar style="auto" />
    </AuthProvider>
  )
}

export default RootLayout;

/*
  SyncList Color Palette
  
  Deep Teal (Primary)  #2A7886

  Sky Blue (Primary Accent) #59A6D9

  Forest Green (Secondary) #509E48

  Mint Green (Secondary Accent) #8DCC88

  Light Grey (Neutral / Background) #EAEAEA

  White (Neutral) #FFFFFF

*/
