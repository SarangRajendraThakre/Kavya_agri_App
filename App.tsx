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


// import { View, Text } from 'react-native'
// import React from 'react'
// import SignupScreen from './src/screens/authScreens/CreateProfile'


// const App = () => {
//   return (
//     <View style={{flex:1}}>
//         <SignupScreen  />
//     </View>
//   )
// }

// export default App