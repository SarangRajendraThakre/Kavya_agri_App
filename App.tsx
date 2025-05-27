// import { View, Text, SafeAreaView } from 'react-native'
// import React from 'react'
// import { Fonts } from './src/utils/Constants'
// import AppNavigator from './src/navigation/AppNavigator'

// const App: React.FC = () => {
//   return (
//      <AppNavigator/>
//   )
// }

// export default App


import { View, Text } from 'react-native'
import React from 'react'
import LoginScreen from './src/screens/authScreens/LoginScreen'
import DemoScalingScreen from './src/screens/DemoScalingScreen'


const App = () => {
  return (
    <View style={{flex:1}}>
        <LoginScreen />
    </View>
  )
}

export default App