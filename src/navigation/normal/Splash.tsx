import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
// Import the necessary navigation types
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';



type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// 3. Apply the SplashProps type to React.FC
const Splash: React.FC<SplashProps> = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      // TypeScript now knows that 'navigation' has a 'navigate' method
      navigation.navigate('Parent');
    }, 2000);

    // Clean up the timer if the component unmounts before the timeout
    return () => clearTimeout(timer);
  }, [navigation]); // 4. Add navigation to the dependency array

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db', // Example background color
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
});