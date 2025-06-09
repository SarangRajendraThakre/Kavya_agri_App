import { View, StyleSheet, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { storage } from '../../utils/storage';
import { jwtDecode } from 'jwt-decode';
import { refreshAuthTokens } from '../../services/token'; // Your API service for token refreshing

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
      console.log("from splash accessToken:", accessToken);
      const refreshToken = storage.getString('refreshToken');
      console.log("from splash refreshToken:", refreshToken);
      const isAppFirstLaunched = storage.getString('isAppFirstLaunched');

      if (isAppFirstLaunched === undefined) {
        // This is genuinely the first launch ever
        storage.set('isAppFirstLaunched', 'false'); // Set for subsequent launches
        navigation.replace('OnboardingScreen');
        return;
      }

      if (!accessToken) {
        // No access token found. User is likely not logged in.
        navigation.replace('OnboardingScreen');
        return;
      }

      // --- Access Token Exists, check its validity ---
      try {
        const decodedAccessToken: { exp: number } = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000; // Current time in seconds

        let shouldProceedToParent = false; // Flag to determine final navigation

        if (decodedAccessToken.exp > currentTime) {
          // Access token is still valid
          console.log('Access token is valid.');
          shouldProceedToParent = true;
        } else {
          // Access token is expired, attempt to refresh
          console.log('Access token expired. Attempting to refresh...');

          if (!refreshToken) {
            console.log('No refresh token found. Navigating to Onboarding.');
            navigation.replace('OnboardingScreen');
            return;
          }

          try {
            const decodedRefreshToken: { exp: number } = jwtDecode(refreshToken);
            if (decodedRefreshToken.exp <= currentTime) {
              console.log('Refresh token also expired. Navigating to Onboarding.');
              navigation.replace('OnboardingScreen');
              return;
            }

            console.log('Attempting to refresh tokens with valid refresh token...');
            const refreshResult = await refreshAuthTokens(refreshToken);

            if (refreshResult.success && refreshResult.accessToken && refreshResult.refreshToken) {
              storage.set('accessToken', refreshResult.accessToken);
              storage.set('refreshToken', refreshResult.refreshToken);
              // Crucially, if refresh token also provides isProfileCompleted, save it here too:
              if (refreshResult.user && typeof refreshResult.user.isProfileCompleted === 'boolean') {
                 storage.set('isProfileCompleted', refreshResult.user.isProfileCompleted);
              }
              console.log('Tokens refreshed successfully.');
              shouldProceedToParent = true;
            } else {
              console.log('Token refresh failed. Navigating to Onboarding.');
              Alert.alert('Session Expired', refreshResult.message || 'Please log in again.');
              navigation.replace('OnboardingScreen');
              return;
            }
          } catch (refreshError) {
            console.error('Error during token refresh process:', refreshError);
            Alert.alert('Session Error', 'Could not refresh session. Please log in again.');
            navigation.replace('OnboardingScreen');
            return;
          }
        }

        // --- FINAL NAVIGATION DECISION ---
        if (shouldProceedToParent) {
          // Now, check the isProfileCompleted status from MMKV
          const profileStatus = storage.getBoolean('isProfileCompleted');
          const isProfileCompleted = typeof profileStatus === 'boolean' ? profileStatus : false; // Default to false

          console.log('MMKV isProfileCompleted status:', isProfileCompleted);

          if (isProfileCompleted) {
            console.log('Profile is completed. Navigating to Parent.');
            navigation.replace('Parent'); // User is logged in and profile is complete
          } else {
            console.log('Profile is NOT completed. Navigating to CreateProfileScreen.');
            navigation.replace('CreateProfileScreen'); // Profile needs completion
          }
        }
      } catch (tokenDecodeError) {
        console.error('Error decoding access token:', tokenDecodeError);
        console.log('Malformed access token. Navigating to Onboarding.');
        Alert.alert('Authentication Error', 'Invalid session data. Please log in again.');
        navigation.replace('OnboardingScreen');
        return;
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