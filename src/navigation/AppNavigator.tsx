// AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screen components
import Splash from './normal/Splash';
import Parent from './normal/Parent';
import { RootStackParamList } from './types';
import PlayGame from '../screens/PlayGame';


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="Splash">
       
        <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name='Parent' component={Parent} options={{ headerShown: false }} />
        <Stack.Screen name='PlayGame' component={PlayGame} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;