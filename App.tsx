import { View, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message'; // Import Toast
import { ProfileProvider } from './src/context/ProfileContext';

const App = () => {
  return (
    <ProfileProvider>
      <View style={styles.container}>
        <StatusBar
          backgroundColor="black" // Sets the background color of the status bar to black
          barStyle="light-content" // Makes the icons (time, battery, etc.) white for visibility on a dark background
        />
        <AppNavigator />
        <Toast /> {/* Add the Toast component here */}
      </View>
    </ProfileProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Ensures the root container also has a black background
  },
});

export default App;