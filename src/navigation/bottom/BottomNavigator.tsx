// BottomNavigator.tsx
import { View, Text, StyleSheet } from 'react-native'; // Added StyleSheet for example
import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Import your screen components
import Screen1 from './Screen1'; // Assuming these are in the same folder or adjust path
import Screen2 from './Screen2';
import Screen3 from './Screen3';

// Import RootTabParamList from your types.ts file
import { RootTabParamList } from '../types'; // Adjust path if types.ts is elsewhere
import { Colors, Fonts } from '../../utils/Constants';

// Create a Bottom Tab Navigator instance, explicitly typing it with RootTabParamList
const Bottom = createBottomTabNavigator<RootTabParamList>();

const BottomNavigator: React.FC = () => {
  return (
    <Bottom.Navigator
      initialRouteName="Screen1" // Set initial tab
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
        }
      }}
    >
      {/*
        Bottom.Screen components infer their types from RootTabParamList.
        'name' prop must match a key in RootTabParamList.
      */}
      <Bottom.Screen name='Screen1' component={Screen1} options={{ title: 'Home'  , headerShown:false }} />
      <Bottom.Screen name='Screen2' component={Screen2} options={{ title: 'Explore'  , headerShown:false }} />
      <Bottom.Screen name='Screen3' component={Screen3} options={{ title: 'Settings' , headerShown:false }} />
    </Bottom.Navigator>
  );
};

export default BottomNavigator;