import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import AuthNavigator from './AuthNavigator';
import ParentNavigator from './ParentNavigator';
import ChildNavigator from './ChildNavigator';
import LoadingScreen from '@/screens/shared/LoadingScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user.role === 'parent' ? (
          <Stack.Screen name="Parent" component={ParentNavigator} />
        ) : (
          <Stack.Screen name="Child" component={ChildNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

