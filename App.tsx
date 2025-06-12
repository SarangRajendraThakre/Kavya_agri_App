import { View, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message'; // Import Toast

const App = () => {
  return (
    <View style={styles.container}>
      {/* Set your desired default StatusBar style here */}
      <StatusBar
        backgroundColor="black"   // Sets the background color of the status bar to black
        barStyle="light-content"  // Makes the icons (time, battery, etc.) white for visibility on a dark background
      />
      <AppNavigator/>
      <Toast /> {/* Add the Toast component here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Ensures the root container also has a black background
  },
});

export default App;