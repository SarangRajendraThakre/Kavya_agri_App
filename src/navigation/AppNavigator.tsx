// AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screen components
import Splash from './normal/Splash';
import Parent from './normal/Parent';
import { RootStackParamList } from './types';

// Import the RootStackParamList type from your centralized types.ts file
// Adjust the path if your types.ts file is in a different location relative to AppNavigator.tsx

// Create a stack navigator instance, explicitly typing it with your RootStackParamList
const Stack = createStackNavigator<RootStackParamList>();

// AppNavigator component, typed as a React Functional Component
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      {/*
        Stack.Navigator uses the RootStackParamList to understand all possible routes
        and their expected parameters.
        'initialRouteName="Splash"' explicitly sets the first screen to display.
      */}
      <Stack.Navigator initialRouteName="Splash">
        {/*
          Stack.Screen components automatically infer their types from RootStackParamList
          based on their 'name' prop.
          'headerShown: false' removes the default navigation header for these screens.
        */}
        <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name='Parent' component={Parent} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;