import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WalletPointsScreen = () => {
  const navigation = useNavigation();
  const animatedPoints = useRef(new Animated.Value(1000)).current;
  const [displayPoints, setDisplayPoints] = useState(1000);

  const actualWalletPoints = 2500;

  useEffect(() => {
    animatedPoints.setValue(1000);
    Animated.timing(animatedPoints, {
      toValue: 0,
      duration: 2000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    const listener = animatedPoints.addListener(({ value }) => {
      setDisplayPoints(Math.floor(value));
    });

    return () => {
      animatedPoints.removeListener(listener);
    };
  }, []);

  // --- START: useFocusEffect for StatusBar control ---
  useFocusEffect(
    React.useCallback(() => {
      // WHEN THIS SCREEN IS FOCUSED (visible)
      // Set status bar to purple background, light content
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#4a0077');
      }

      // WHEN THIS SCREEN IS BLURRED (navigated away from)
      return () => {
        // --- THIS IS THE CRUCIAL CHANGE ---
        // Reset status bar to your app's default: black background, light content
        StatusBar.setBarStyle('light-content'); // Set to light-content for visibility on black
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('black'); // Set background to black
        }
      };
    }, []) // Empty dependency array means this effect only runs on screen focus/blur
  );
  // --- END: useFocusEffect for StatusBar control ---

  return (
    <View style={styles.fullScreen}>
      {/* REMOVE THE <StatusBar> COMPONENT FROM HERE */}
      {/* <StatusBar barStyle="light-content" backgroundColor="#4a0077" /> */}

      {/* Solid Purple Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Wallet</Text>
      </SafeAreaView>

      {/* Main Content Area with Gradient */}
      <LinearGradient
        colors={['#4a0077', '#000000']} // Deep purple to black gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.contentContainer}
      >
        <View style={styles.content}>
          {/* Wallet Icon */}
          <Icon name="wallet-outline" size={80} color="#FFD700" style={styles.walletIcon} />
          {/* Animated Point Value */}
          <Animated.Text style={styles.pointValue}>
            {displayPoints.toLocaleString()}
          </Animated.Text>
          {/* Label */}
          <Text style={styles.pointLabel}>Wallet Points</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#4a0077', // Default background for the header
  },
  header: {
    backgroundColor: '#4a0077', // Solid purple header
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Handle Android status bar
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // To align back button and title
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, // Take available space
    textAlign: 'center', // Center title
    marginRight: 60, // Offset for back button to keep title centered
  },
  contentContainer: {
    flex: 1, // Takes the rest of the screen below the header
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: {
    marginBottom: 20,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  pointValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  pointLabel: {
    fontSize: 24,
    color: '#E0E0E0',
    opacity: 0.8,
  },
});

export default WalletPointsScreen;