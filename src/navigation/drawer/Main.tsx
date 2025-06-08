// Main.tsx
import { View, Text } from 'react-native'
import React from 'react'
import BottomNavigator from '../bottom/BottomNavigator'

interface MainProp {
    // If 'Main' screen itself were to receive props, they would be defined here.
    // In this case, it just wraps BottomNavigator, so no specific props are expected.
}

const Main: React.FC<MainProp> = () => {
  return (
    <View style={{flex : 1}}>
      <BottomNavigator/>
    </View>
  )
}

export default Main