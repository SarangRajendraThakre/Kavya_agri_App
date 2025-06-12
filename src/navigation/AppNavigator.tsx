// AppNavigator.tsx
import React from 'react'; // useEffect and useState are no longer needed here
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

// Import your screen components
import Splash from './normal/Splash';
import Parent from './normal/Parent';
import OnboardingScreen from '../screens/OnBoardingScreen';

import LoginScreen from '../screens/authScreens/LoginScreen';

// Import your RootStackParamList from types.ts
import {RootStackParamList} from './types';
import SuccessScreen from '../screens/authScreens/SuccessScreen';
import {navigationRef} from '../utils/NavigationUtils';
import CreateProfileScreen from '../screens/authScreens/CreateProfileScreen';
import ProfileSuccessfulScreen from '../screens/authScreens/ProfileSuccessfulScreen';

// MMKV is no longer needed directly in AppNavigator, it's in Splash now

// import { MMKV } from 'react-native-mmkv';

const Stack = createStackNavigator<RootStackParamList>();

// storage is now used directly in Splash.tsx
// const storage = new MMKV();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      {/* initialRouteName is now fixed to 'Splash' */}
      <Stack.Navigator initialRouteName="Splash">
        {/* All screens are unconditionally rendered now */}
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
          name="Parent"
          component={Parent}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
