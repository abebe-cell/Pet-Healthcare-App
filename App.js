import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import SplashLoginScreen from './Screens/SplashLoginScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import DashboardScreen from './Screens/DashboardScreen';
import ProfileScreen from './Screens/ProfileScreen';
import SettingsScreen from './Screens/SettingsScreen';
import HelpSupportScreen from './Screens/HelpSupportScreen';
import PetTrackerScreen from './Screens/PetTrackerScreen';
import PetTrackerRegistrationScreen from './Screens/PetTrackerRegistrationScreen';
import PetTrackerMapScreen from './Screens/PetTrackerMapScreen';
import VetClinicsMapScreen from './Screens/VetClinicsMapScreen';
import SymptomCheckerScreen from './Screens/SymptomCheckerScreen';
import PetCareLibraryScreen from './Screens/PetCareLibraryScreen';

const supabaseUrl = 'https://rocijgygxhdeygpgaqre.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvY2lqZ3lneGhkZXlncGdhcXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MjE2NTUsImV4cCI6MjA4MDA5NzY1NX0.3zBdmV4JcgmSkbvNkNGknMF0_edLtmwdbXzHr1P3G-U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

const Stack = createNativeStackNavigator();

// Auth Stack - no swipe back
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}
  >
    <Stack.Screen name="SplashLoginScreen" component={SplashLoginScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignupScreen" component={SignupScreen} />
  </Stack.Navigator>
);

// App Stack - swipe back enabled
const AppStack = ({ darkModeEnabled, setDarkModeEnabled }) => {
  const SettingsWrapper = (props) => (
    <SettingsScreen
      {...props}
      darkModeEnabled={darkModeEnabled}
      setDarkModeEnabled={setDarkModeEnabled}
    />
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsWrapper} />
      <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
      <Stack.Screen name="PetTrackerScreen" component={PetTrackerScreen} />
      <Stack.Screen name="PetTrackerRegistrationScreen" component={PetTrackerRegistrationScreen} />
      <Stack.Screen name="PetTrackerMapScreen" component={PetTrackerMapScreen} />
      <Stack.Screen name="VetClinicsMapScreen" component={VetClinicsMapScreen} />
      <Stack.Screen name="SymptomCheckerScreen" component={SymptomCheckerScreen} />
      <Stack.Screen name="PetCareLibraryScreen" component={PetCareLibraryScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  const theme = darkModeEnabled ? MD3DarkTheme : MD3LightTheme;
  const navTheme = darkModeEnabled ? NavDarkTheme : NavDefaultTheme;

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth event:', event, newSession ? 'logged in' : 'logged out');
      setSession(newSession);

      // Clear AsyncStorage on logout
      if (!newSession) {
        AsyncStorage.clear().catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navTheme}>
        {session ? (
          <AppStack
            darkModeEnabled={darkModeEnabled}
            setDarkModeEnabled={setDarkModeEnabled}
          />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}