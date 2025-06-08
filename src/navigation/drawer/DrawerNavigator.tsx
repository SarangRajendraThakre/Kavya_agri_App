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
import CourseDetailScreen from '../../screens/paymentScreens/CourseDetailScreen';
import CourseListScreen from '../../screens/paymentScreens/CourseListScreen';
import AboutUsScreen from '../../screens/AboutUsScreen';
import ProfileEditScreen from '../../screens/ProfileEditScreen';
import CareerDetailScreen from '../../components/CareerDetailScreen';

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
          headerShown: false,
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
          headerShown: false,
          title: 'false',
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
        name="CourseList"
        component={CourseListScreen}
        options={{ title: 'All Courses' }}
      />
      <Drawer.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({
          title: route.params?.course?.title ?? 'Course Details',
          headerShown: true, // Ensure header is visible
        })}
      />
      <Drawer.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
        options={({ route }) => ({
          title: 'Profile Edit',
          headerShown: false, // Ensure header is visible
        })}
      />
         <Drawer.Screen
        name="CareerDetail"
        component={CareerDetailScreen}
        options={({ route }) => ({
          title: 'Profile Edit',
          headerShown: false, // Ensure header is visible
        })}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;