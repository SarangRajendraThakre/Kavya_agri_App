import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  Clipboard, // Import Clipboard for copy functionality
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons, if you have it installed
import Toast from 'react-native-toast-message'; // Import Toast
import { storage } from '../../utils/storage';

const ReferralScreen = () => {
  const navigation = useNavigation();
  // --- Your actual referral code ---
  const referralCode = storage.getString('referralCode');

  // Status Bar management using useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
      // WHEN THIS SCREEN IS FOCUSED (visible)
      StatusBar.setBarStyle('light-content'); // White text/icons for dark background
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('black'); // Black status bar background
      }

      // WHEN THIS SCREEN IS BLURRED (navigated away from)
      return () => {
        // Reset status bar to your app's default (black background, light content)
        StatusBar.setBarStyle('light-content');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('black');
        }
      };
    }, [])
  );

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Toast.show({
      type: 'success', // or 'info', 'error'
      text1: 'Referral Code Copied!',
      text2: 'Share it with your friends!',
      topOffset: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 60, // Adjust position
      visibilityTime: 2000, // 2 seconds
    });
  };

  return (
    <View style={styles.fullScreen}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer Now</Text>
      </SafeAreaView>

      <View style={styles.contentContainer}>
        <Text style={styles.promoText}>
          Invite friends and earn rewards when they sign up!
        </Text>

        <TouchableOpacity
          style={styles.referralCard}
          onPress={handleCopyCode}
          activeOpacity={0.7}
        >
          <Text style={styles.referralLabel}>Your Referral Code</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.referralCodeText}>{referralCode}</Text>
            <Icon name="copy-outline" size={20} color="#FFD700" style={styles.copyIcon} />
          </View>
          <Text style={styles.tapToCopyText}>Tap to copy</Text>
        </TouchableOpacity>

        <Text style={styles.instructionsText}>
          Share this code with your friends and family.
          {"\n"}They get benefits, and you get rewards!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
    padding: 10,
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  promoText: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 25,
  },
  referralCard: {
    backgroundColor: '#333333', // Dark grey background for the card
    borderRadius: 15,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    elevation: 10, // Android shadow
    shadowColor: '#FFD700', // Gold shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#555555', // Slightly lighter border
  },
  referralLabel: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  referralCodeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for the code
    letterSpacing: 2,
    marginRight: 10,
  },
  copyIcon: {
    marginLeft: 5,
  },
  tapToCopyText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  instructionsText: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
});

export default ReferralScreen;