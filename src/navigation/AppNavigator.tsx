// AppNavigator.tsx
import React from 'react'; // useEffect and useState are no longer needed here
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

// Import your screen components
import Splash from './normal/Splash';
import Parent from './normal/Parent';
import PlayGame from '../screens/PlayGame';
import OnboardingScreen from '../screens/OnBoardingScreen';

import LoginScreen from '../screens/authScreens/LoginScreen';

// Import your RootStackParamList from types.ts
import {RootStackParamList} from './types';
import CreateProfile from '../screens/authScreens/CreateProfile';
import OtpScreen from '../screens/authScreens/OtpScreen';
import SuccessScreen from '../screens/authScreens/SuccessScreen';
import { navigationRef } from '../utils/NavigationUtils';

// MMKV is no longer needed directly in AppNavigator, it's in Splash now

// import { MMKV } from 'react-native-mmkv';

const Stack = createStackNavigator<RootStackParamList>();

// storage is now used directly in Splash.tsx
// const storage = new MMKV();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer   ref={navigationRef} >
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
          name="PlayGame"
          component={PlayGame}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen name='OtpScreen' component={OtpScreen}    options={{headerShown: false}}  />
        <Stack.Screen  name='SuccessScreen' component={SuccessScreen}    options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
