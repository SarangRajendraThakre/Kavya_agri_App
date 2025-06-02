import { View, StyleSheet, Image, Alert } from 'react-native'; // Import Alert for user feedback
import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Adjust path if needed

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { storage } from '../../utils/storage'; // Your MMKV strage instance
// Assuming you have a utility to decode JWTs on the client-side
import { jwtDecode } from 'jwt-decode'; // You'll need to install this: `npm install jwt-decode` or `yarn add jwt-decode`
import { refreshAuthTokens } from '../../services/token';

// Import your API service for token refreshing

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animation (optional)
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });

    const checkAuthAndNavigate = async () => {
      // Simulate splash screen duration first
      await new Promise(resolve => setTimeout(resolve, 2000)); // Show splash for 2 seconds

      const accessToken = storage.getString('accessToken');
      console.log("from splash"+accessToken);
      const refreshToken = storage.getString('refreshToken');
      console.log(refreshToken);
      const isAppFirstLaunched = storage.getString('isAppFirstLaunched');

      if (isAppFirstLaunched === undefined) {
        // This is genuinely the first launch ever
        storage.set('isAppFirstLaunched', 'false'); // Set for subsequent launches
        navigation.replace('OnboardingScreen');
        return; // Exit as we've navigated
      }

      if (!accessToken) {
        // No access token found. User is likely not logged in.
        // Even if refreshToken exists, without an accessToken, we assume a fresh start.
        navigation.replace('OnboardingScreen'); // Go to Onboarding/Login screen
        return; // Exit as we've navigated
      }

      // --- Access Token Exists, check its validity ---
      try {
        const decodedAccessToken: { exp: number } = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decodedAccessToken.exp > currentTime) {
          // Access token is still valid
          console.log('Access token is valid. Navigating to Parent.');
          navigation.replace('Parent'); // User is logged in and token is fresh
          return; // Exit as we've navigated
        } else {
          // Access token is expired
          console.log('Access token expired. Attempting to refresh...');

          if (!refreshToken) {
            // No refresh token available, or it was already used/invalidated
            console.log('No refresh token found. Navigating to Onboarding.');
            navigation.replace('OnboardingScreen'); // Force re-login
            return; // Exit
          }

          // --- Access Token Expired, try to refresh using Refresh Token ---
          try {
            const decodedRefreshToken: { exp: number } = jwtDecode(refreshToken);
            if (decodedRefreshToken.exp <= currentTime) {
              // Refresh token is also expired
              console.log('Refresh token also expired. Navigating to Onboarding.');
              navigation.replace('OnboardingScreen'); // Force re-login
              return; // Exit
            }

            // Refresh token is valid, attempt to get a new access token
            console.log('Attempting to refresh tokens with valid refresh token...');

            console.log(refreshToken);
         
            const refreshResult = await refreshAuthTokens(refreshToken);

            if (refreshResult.success && refreshResult.accessToken && refreshResult.refreshToken) {
              // Successfully got new tokens
              storage.set('accessToken', refreshResult.accessToken);
              storage.set('refreshToken', refreshResult.refreshToken);
              console.log('Tokens refreshed successfully. Navigating to Parent.');
              navigation.replace('Parent'); // Navigate to main app
              return; // Exit
            } else {
              // Refresh failed for other reasons (e.g., token revoked on server)
              console.log('Token refresh failed. Navigating to Onboarding.');
              Alert.alert('Session Expired', refreshResult.message || 'Please log in again.');
              navigation.replace('OnboardingScreen'); // Force re-login
              return; // Exit
            }
          } catch (refreshError) {
            // Error during refresh token decoding or API call
            console.error('Error during token refresh process:', refreshError);
            Alert.alert('Session Error', 'Could not refresh session. Please log in again.');
            navigation.replace('OnboardingScreen'); // Force re-login
            return; // Exit
          }
        }
      } catch (tokenDecodeError) {
        // Error decoding access token (e.g., malformed token)
        console.error('Error decoding access token:', tokenDecodeError);
        console.log('Malformed access token. Navigating to Onboarding.');
        Alert.alert('Authentication Error', 'Invalid session data. Please log in again.');
        navigation.replace('OnboardingScreen'); // Force re-login
        return; // Exit
      }
    };

    checkAuthAndNavigate();
  }, [navigation, scale, opacity]); // Dependencies for useEffect

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <LinearGradient
      colors={['#5e6d71', '#f9f4d7', '#5e6d71']}
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
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});