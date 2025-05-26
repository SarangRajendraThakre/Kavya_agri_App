import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Fonts } from './src/utils/Constants'
import AppNavigator from './src/navigation/AppNavigator'

const App: React.FC = () => {
  return (
     <AppNavigator/>
  )
}

export default App