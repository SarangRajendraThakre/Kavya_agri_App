import { View, Text } from 'react-native'
import React from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import GoogleButton from './src/components/GoogleButton'
import LoginScreen from './src/screens/authScreens/LoginScreen'

const App = () => {
  return (
    <LoginScreen/>
  )
}

export default App