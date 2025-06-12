import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  Easing,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const CertificateScreen = () => {
  const navigation = useNavigation();
  const sparkleAnimation = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null); // Ref for Lottie animation control

  // Sparkle animation for the certificate image
  useEffect(() => {
    const animateSparkle = () => {
      sparkleAnimation.setValue(0);
      Animated.sequence([
        Animated.timing(sparkleAnimation, {
          toValue: 1,
          duration: 1500, // Duration of one sparkle cycle
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => animateSparkle()); // Loop the sparkle animation
    };

    animateSparkle(); // Start the sparkle animation when component mounts
  }, []);

  // Lottie animation control and StatusBar management
  useFocusEffect(
    React.useCallback(() => {
      // When screen is focused
      if (lottieRef.current) {
        lottieRef.current.play(); // Play Lottie animation
      }
      StatusBar.setBarStyle('light-content'); // Dark status bar text/icons for dark background
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('black'); // Black status bar background for Android
      }

      // When screen is blurred
      return () => {
        if (lottieRef.current) {
          lottieRef.current.reset(); // Reset Lottie animation
        }
        // Reset status bar to your app's default (e.g., black background, light content)
        StatusBar.setBarStyle('light-content');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('black');
        }
      };
    }, [])
  );

  // Interpolate for the sparkle effect
  const sparkleScale = sparkleAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1], // Small scale animation for "sparkle"
  });

  const sparkleOpacity = sparkleAnimation.interpolate({
    inputRange: [0, 0.25, 0.75, 1],
    outputRange: [1, 0.8, 0.8, 1], // Opacity flicker for "sparkle"
  });

  return (
    <View style={styles.fullScreen}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>Your Achievement</Text>
      </SafeAreaView>

      <View style={styles.contentContainer}>
        {/* Lottie Animation (Confetti/Sparkle) */}
        <LottieView
          ref={lottieRef}
          source={require('../../assets/animation/Celebration.json')} // Adjust path to your Lottie file
          autoPlay={false} // We'll control playback with useFocusEffect
          loop={true} // Loop the animation
          style={styles.lottieAnimation}
        />

        {/* Certificate Image with Sparkle Effect */}
        <Animated.View
          style={[
            styles.certificateWrapper,
            {
              transform: [{ scale: sparkleScale }],
              opacity: sparkleOpacity,
            },
          ]}
        >
          <Image
            source={require('../../assets/pdf/certificate.jpg')} // Adjust path to your certificate image
            style={styles.certificateImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.congratulationsText}>Congratulations!</Text>
        <Text style={styles.subText}>You've earned your certificate!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: 'black', // Set screen background to black
  },
  header: {
    backgroundColor: 'black', // Match header to screen background
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#FFD700', // Gold color for title
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Ensure content area is also black
    paddingHorizontal: 20,
  },
  lottieAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0, // Ensure Lottie is behind certificate
    pointerEvents: 'none', // Allow touches to pass through
  },
  certificateWrapper: {
    width: '85%', // Adjust as needed
    aspectRatio: 1.414, // A4 paper aspect ratio (approx)
    backgroundColor: '#FFFFFF', // White background for the certificate card
    borderRadius: 15,
    overflow: 'hidden', // Clip certificate image if it overflows
    elevation: 15, // Android shadow
    shadowColor: '#FFD700', // Gold shadow for glow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificateImage: {
    width: '100%',
    height: '100%',
  },
  congratulationsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
    marginTop: 20,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subText: {
    fontSize: 18,
    color: '#E0E0E0',
    marginTop: 10,
    opacity: 0.8,
  },
});

export default CertificateScreen;