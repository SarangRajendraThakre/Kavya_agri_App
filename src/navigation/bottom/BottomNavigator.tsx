// BottomNavigator.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Make sure this RootTabParamList import is correct
import { RootTabParamList } from '../types'; // Adjust path as needed

import Home from './Home';
import Explore from './CareerAdda';
import Share from './ContactUs';
import ContactUs from './ContactUs';
import CareerAdda from './CareerAdda';

const Colors = {
  primary: '#007AFF',
  inactive: '#8E8E93',
  backgroundDark: '#1C1C1E',
  text: '#FFFFFF',
};

const Fonts = {
  SatoshiBold: 'System',
};

const Bottom = createBottomTabNavigator<RootTabParamList>();

const BottomNavigator: React.FC = () => {
  return (
    <Bottom.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          backgroundColor: Colors.backgroundDark,
          borderTopWidth: 0,
        },
        headerShown: false,
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
      <Bottom.Screen
        name='Home'
        component={Home}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ color: color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Bottom.Screen
        name='CareerAdda'
        component={CareerAdda}
        options={{
          title: 'CareerAdda',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ color: color, fontSize: size }}>🔍</Text>
          ),
        }}
      />
      <Bottom.Screen
        name='ContactUs'
        component={ContactUs}
        options={{
          title: 'ContactUs',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ color: color, fontSize: size }}>📤</Text>
          ),
        }}
      />
    </Bottom.Navigator>
  );
};

export default BottomNavigator;