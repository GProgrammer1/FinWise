import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '@/screens/parent/DashboardScreen';
import ExpensesScreen from '@/screens/parent/ExpensesScreen';
import UpcomingExpensesScreen from '@/screens/parent/UpcomingExpensesScreen';
import BudgetScreen from '@/screens/parent/BudgetScreen';
import SettingsScreen from '@/screens/shared/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ParentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarLabel: 'Expenses',
        }}
      />
      <Tab.Screen
        name="Upcoming"
        component={UpcomingExpensesScreen}
        options={{
          tabBarLabel: 'Upcoming',
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarLabel: 'Budget',
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

export default function ParentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={ParentTabs} />
    </Stack.Navigator>
  );
}

