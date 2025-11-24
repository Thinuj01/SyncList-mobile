import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#59A6D9'
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'All Lists',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan Code',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" color={color} size={size} />
          ),
        }}
      />
      
    </Tabs>
  );
}