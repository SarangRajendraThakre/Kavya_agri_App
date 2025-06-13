// AppNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

// Import your screen components
import Splash from './normal/Splash';
import Parent from './normal/Parent'; // This is likely your DrawerNavigator or TabNavigator
import OnboardingScreen from '../screens/OnBoardingScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import SuccessScreen from '../screens/authScreens/SuccessScreen';
import CreateProfileScreen from '../screens/authScreens/CreateProfileScreen';
import ProfileSuccessfulScreen from '../screens/authScreens/ProfileSuccessfulScreen';

// --- Import the Payment Flow Screens ---
import PaymentDetail from '../screens/paymentScreens/PaymentDetail';
import CourseDetailScreen from '../screens/paymentScreens/CourseDetailScreen';
import PaymentSuccessScreen from '../screens/paymentScreens/PaymentSuccessScreen';
// --- End Payment Flow Screens Imports ---

// Import your RootStackParamList from types.ts
import {RootStackParamList} from './types';
import {navigationRef} from '../utils/NavigationUtils';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash">
        {/* Core App Flow Screens */}
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SuccessScreen"
          component={SuccessScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateProfileScreen"
          component={CreateProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileSuccessfulScreen"
          component={ProfileSuccessfulScreen}
          options={{headerShown: false}}
        />

        {/* --- Payment Flow Screens (Added Here) --- */}
        <Stack.Screen
          name="PaymentDetail"
          component={PaymentDetail}
          options={{headerShown: false}} // You might want a header for back button etc.
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{headerShown: false}} // You might want a header for back button etc.
        />
        <Stack.Screen
          name="PaymentSuccess" // Ensure this matches the name in RootStackParamList from types.ts
          component={PaymentSuccessScreen}
          options={{headerShown: false}} // Usually no header on success screens
        />
        {/* --- End Payment Flow Screens --- */}

        {/* Main Application Entry Point (after auth/onboarding) */}
        <Stack.Screen
          name="Parent" // This screen will typically render your DrawerNavigator
          component={Parent}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;