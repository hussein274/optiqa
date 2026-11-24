import React, { useEffect } from 'react';

import { useFonts } from '@expo-google-fonts/mulish';
import {
  Mulish_400Regular,
  Mulish_500Medium,
  Mulish_600SemiBold,
  Mulish_700Bold,
} from '@expo-google-fonts/mulish';

import AppNavigator from './src/navigation/AppNavigator';
import useAuthStore from './src/features/auth/store/authStore';

export default function App() {
  const [fontsLoaded] = useFonts({
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
  });

  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!fontsLoaded) {
    return null;
  }

  return <AppNavigator />;
}