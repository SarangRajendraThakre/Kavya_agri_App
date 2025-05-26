// normal/Splash.tsx
import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Adjust path if needed
import { MMKV } from 'react-native-mmkv'; // Import MMKV

// Import Animated and related from reanimated if you want the animation here
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient'; // If you want the gradient on Splash

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const storage = new MMKV(); // MMKV storage instance here, or pass it down

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  // Reanimated state for animation (optional, but good for visual feedback)
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animation (optional)
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });

    const checkFirstLaunchAndNavigate = async () => {
      // Simulate splash screen duration first
      await new Promise(resolve => setTimeout(resolve, 2000)); // Show splash for 2 seconds

      const appData = storage.getString('isAppFirstLaunched');

      if (appData === undefined) {
        // This is the first launch
        storage.set('isAppFirstLaunched', 'false'); // Set for subsequent launches
        navigation.replace('OnboardingScreen'); // Go to Onboarding
      } else {
        // Not the first launch, go to main app content
        // You might have logic here to check if user is logged in
        // For now, let's assume Parent is your main entry for returning users
        // Or you might navigate to LoginScreen/SignupScreen
        navigation.replace('Parent'); // Go to your main app entry point
      }
    };

    checkFirstLaunchAndNavigate();
  }, [navigation, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    // You can keep the gradient or use a simple background color
    <LinearGradient
      colors={['#5e6d71', '#f9f4d7', '#5e6d71']} // Adjust to your logo's gradient if desired
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={animatedStyle}>
        <Image
          source={require('../../assets/icons/logoT.png')} 
          style={styles.image}
        />
      </Animated.View>
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#3498db', // This will be overridden by LinearGradient
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});