import { View, Text } from 'react-native'
import React from 'react'
import BottomNavigator from '../bottom/BottomNavigator'

interface MainProp {


}

const Main: React.FC<MainProp> = () => {
  return (
    <View style={{flex : 1}}>
        <BottomNavigator/>
    </View>
  )
}

export default Main