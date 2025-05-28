import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

// Firebase imports (using modular API)
import { getApp } from '@react-native-firebase/app';
import { getAuth, GoogleAuthProvider } from '@react-native-firebase/auth';
import type { User } from '@react-native-firebase/auth';

// Google Sign-in imports
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

import { fontR, moderateScale, scale } from '../utils/Scaling';
import GoogleIcon from '../assets/icons/google.svg';
import { storage } from '../utils/storage';

// Import MMKV storage instance


// --- IMPORTANT: Replace with your actual Web Client ID from Firebase ---
const WEB_CLIENT_ID = '248628718653-g37462gv6b5n2ks3unindsqgh8r7cpaq.apps.googleusercontent.com';

// Define your backend URL for user data submission
const BACKEND_API_URL = 'http://192.168.103.188:3000/userCreation'; // <--- Adjust this to your backend endpoint

export default function GoogleButton() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const firebaseApp = getApp();
  const firebaseAuth = getAuth(firebaseApp);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });

    const subscriber = firebaseAuth.onAuthStateChanged((firebaseUser: User | null) => {
      setUser(firebaseUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    return subscriber;
  }, []);

  // Function to send user data to your backend
  const sendUserDataToBackend = async (userData: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    idToken: string; // Google ID Token
    accessToken: string; // Firebase Access Token (from getIdToken)
  }) => {
    try {
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.accessToken}`, // Send Firebase ID token for backend verification
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send user data to backend');
      }

      const responseData = await response.json();
      console.log('Backend response:', responseData);
      Alert.alert('Backend Success', 'User data sent and processed by backend!');
      return responseData; // Return data from backend if needed
    } catch (error: any) {
      console.error('Error sending user data to backend:', error);
      Alert.alert('Backend Error', `Failed to sync user data with backend: ${error.message || 'Unknown error'}`);
      throw error; // Re-throw to handle in onGoogleButtonPress if needed
    }
  };


  // Function to handle Google Sign-in button press
  const onGoogleButtonPress = async () => {
    setLoading(true); // Start loading

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        idToken = signInResult.idToken;
      }

      if (!idToken) {
        throw new Error('Google Sign-in did not return an ID token.');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await firebaseAuth.signInWithCredential(googleCredential);

      // Successfully signed in to Firebase
      Alert.alert('Success', 'Signed in with Google and Firebase!');

      // Get Firebase ID token for backend authentication
      const firebaseIdToken = await userCredential.user.getIdToken();

      // --- Store user details in MMKV ---
      const userDataToStore = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        idToken: idToken, // Google ID Token
        firebaseAccessToken: firebaseIdToken, // Firebase ID Token for backend auth
      };

      // Store as a string
      storage.set('user_data', JSON.stringify(userDataToStore));
      console.log('User data stored in MMKV:', userDataToStore);

      // --- Send user details to your backend ---
      await sendUserDataToBackend({
        uid: userDataToStore.uid,
        email: userDataToStore.email,
        displayName: userDataToStore.displayName,
        photoURL: userDataToStore.photoURL,
        idToken: userDataToStore.idToken, // Google ID Token
        accessToken: userDataToStore.firebaseAccessToken, // Firebase ID Token
      });

    } catch (error: any) {
      console.error("Google Sign-in Error:", error);

      if (error && typeof error === 'object') {
        if (error.code) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            Alert.alert('Sign In Cancelled', 'You cancelled the Google Sign-in process.');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            Alert.alert('Sign In In Progress', 'Google Sign-in is already in progress.');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            Alert.alert('Play Services Not Available', 'Google Play Services are not available or outdated. Please update them.');
          } else if (error.code === 'auth/developer-error') {
            Alert.alert('Configuration Error', 'DEVELOPER_ERROR: Check your SHA-1 fingerprint AND Web Client ID in Firebase/Google Cloud Console.');
          } else {
            Alert.alert('Sign In Failed', `An unexpected error occurred: ${error.message || 'Unknown error'}`);
          }
        } else {
          Alert.alert('Sign In Failed', `An unexpected error occurred. Details: ${JSON.stringify(error)}`);
        }
      } else {
        Alert.alert('Sign In Failed', `An entirely unexpected error occurred: ${error ? String(error) : 'Unknown'}`);
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await firebaseAuth.signOut();

      // --- Clear user data from MMKV on sign out ---
      storage.delete('user_data');
      console.log('User data cleared from MMKV.');

      Alert.alert('Signed Out', 'You have successfully signed out.');
      console.log('User signed out from Google and Firebase.');
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      Alert.alert('Sign Out Failed', `An error occurred during sign out: ${error.message || 'Unknown error'}`);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.statusText}>Initializing Firebase...</Text>
      </View>
    );
  }

  // You might want to conditionally render a "Sign Out" button if `user` is not null
  // For the purpose of the LoginScreen, we're assuming this button is primarily for sign-in.
  // If `user` is not null, the user is already authenticated.
  if (user) {
    return (
      <View style={styles.socialButtonsContainer}>
        <Text style={styles.socialButtonText}>Logged in as: {user.displayName || user.email}</Text>
        <TouchableOpacity style={styles.socialButton} onPress={signOut}>
          <Text style={styles.socialButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity
        style={styles.socialButton}
        onPress={onGoogleButtonPress}
        disabled={loading}
      >
        <GoogleIcon width={scale(24)} height={scale(24)} />
        <Text style={styles.socialButtonText}>
          {loading ? 'Signing in...' : 'Sign in With Google '}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: moderateScale(30),
    paddingHorizontal: moderateScale(20),
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#DDD',
    width: '100%',
    justifyContent: 'center',
  },
  socialButtonText: {
    paddingLeft: scale(10),
    fontSize: fontR(16),
    color: '#333',
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
});
