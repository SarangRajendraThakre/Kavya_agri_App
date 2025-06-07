// BottomNavigator.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Define a simple RootTabParamList interface for type safety
// This would typically be in a separate types.ts file in a real project
type RootTabParamList = {
  Home: undefined; // No params for Home screen
  Explore: undefined;
  Share: undefined;
};

// Import your screen components
// Ensure these paths are correct relative to your BottomNavigator.tsx file
import Home from './Home';
import Explore from './Explore';
import Share from './Share';

// Assuming you have a file for Colors and Fonts constants,
// otherwise, you'll need to define them or replace with direct values.
const Colors = {
  primary: '#007AFF', // Example primary color (blue)
  inactive: '#8E8E93', // Example inactive color (gray)
  backgroundDark: '#1C1C1E', // Example dark background
  text: '#FFFFFF', // Example text color
};

const Fonts = {
  SatoshiBold: 'System', // Placeholder: replace with your actual font
};

// Create a Bottom Tab Navigator instance, explicitly typing it with RootTabParamList
const Bottom = createBottomTabNavigator<RootTabParamList>();

const BottomNavigator: React.FC = () => {
  return (
    <Bottom.Navigator
      initialRouteName="Home" // Set initial tab
      screenOptions={{
        tabBarActiveTintColor: Colors.primary, // Example: active tab color
        tabBarInactiveTintColor: Colors.inactive, // Example: inactive tab color
        tabBarStyle: {
          backgroundColor: Colors.backgroundDark, // Example: tab bar background
          borderTopWidth: 0, // Remove top border
        },
        headerShown: false, // You can control header visibility per screen or globally
        headerStyle: {
          backgroundColor: Colors.backgroundDark,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontFamily: Fonts.SatoshiBold,
          fontSize: 20,
        },
      }}
    >
      {/*
        Bottom.Screen components infer their types from RootTabParamList.
        'name' prop must match a key in RootTabParamList.
      */}
      <Bottom.Screen
        name='Home'
        component={Home}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            // You can use a library like react-native-vector-icons here
            // For simplicity, using a Text component with an emoji/character
            <Text style={{ color: color, fontSize: size }}>🏠</Text> // Home icon
          ),
        }}
      />
      <Bottom.Screen
        name='Explore'
        component={Explore}
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ color: color, fontSize: size }}>🔍</Text> // Explore icon
          ),
        }}
      />
      <Bottom.Screen
        name='Share'
        component={Share}
        options={{
          title: 'Share',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ color: color, fontSize: size }}>📤</Text> // Share icon
          ),
        }}
      />
    </Bottom.Navigator>
  );
};

// You can add styles here if needed, but for tabBarIcon, inline styles are common.
const styles = StyleSheet.create({
  // Add any specific styles for the navigator or icons if desired
});

export default BottomNavigator;
