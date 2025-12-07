import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MySpendingScreen from '@/screens/child/MySpendingScreen';
import RequestsScreen from '@/screens/child/RequestsScreen';
import NotificationsScreen from '@/screens/child/NotificationsScreen';
import SettingsScreen from '@/screens/shared/SettingsScreen';
import { useNotificationStore } from '@/store/notificationStore';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ChildTabs() {
  const { unreadCount, loadNotifications } = useNotificationStore();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MySpending"
        component={MySpendingScreen}
        options={{
          tabBarLabel: 'My Spending',
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          tabBarLabel: 'Requests',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

export default function ChildNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={ChildTabs} />
    </Stack.Navigator>
  );
}

