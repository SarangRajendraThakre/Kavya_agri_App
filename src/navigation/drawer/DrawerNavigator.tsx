// DrawerNavigator.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';

// Import your screen components
import Main from './Main'; // Adjust path if needed
import CustomDrawer from './CustomDrawer'; // Adjust path if needed

// Import RootDrawerParamList from your types.ts file
import { RootDrawerParamList } from '../types'; // Adjust path if types.ts is elsewhere
import { Colors, Fonts } from '../../utils/Constants';
import AboutUsScreen from '../../pages/AboutUsScreen';

// Create a Drawer Navigator instance, explicitly typing it with RootDrawerParamList
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      // CORRECTED: drawerContent prop type uses DrawerContentComponentProps directly
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawer {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.backgroundDark,
        },
        drawerLabelStyle: {
          fontFamily: Fonts.SatoshiRegular,
          fontSize: 16,
        },
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.inactive,
      }}
    >
      <Drawer.Screen
        name='Main'
        component={Main}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: Colors.backgroundDark,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontFamily: Fonts.SatoshiBold,
            fontSize: 20,
          }
        }}
      />

         <Drawer.Screen
        name='AboutUsScreen'
        component={AboutUsScreen}
        options={{
          headerShown: true,
          title: 'Home',
          headerStyle: {
            backgroundColor: Colors.backgroundDark,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontFamily: Fonts.SatoshiBold,
            fontSize: 20,
          }
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;