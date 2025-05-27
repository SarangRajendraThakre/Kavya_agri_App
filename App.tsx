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
import { getApp } from '@react-native-firebase/app'; // For getting the app instance
import { getAuth, GoogleAuthProvider } from '@react-native-firebase/auth'; // For auth methods and GoogleAuthProvider

// Google Sign-in imports
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

// --- IMPORTANT: Replace with your actual Web Client ID from Firebase ---
// Go to Firebase Console -> Authentication -> Sign-in method -> Google -> Web SDK configuration.
// VERIFY in your android/app/google-services.json file: look for client_type: 3 under oauth_client.
const WEB_CLIENT_ID = '248628718653-g37462gv6b5n2ks3unindsqgh8r7cpaq.apps.googleusercontent.com';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null); // Firebase user object

  // Get the default Firebase app and auth instances once
  const firebaseApp = getApp();
  const firebaseAuth = getAuth(firebaseApp);

  // Handle user state changes (Firebase Auth listener)
  useEffect(() => {
    // 1. Configure Google Sign-in SDK
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, // This client ID is crucial
      offlineAccess: true,        // Request code for offline access to Google APIs (optional)
      // scopes: ['profile', 'email'], // Default scopes for Google Sign-in, add more if needed
    });

    // 2. Set up Firebase Authentication state listener
    const subscriber = firebaseAuth.onAuthStateChanged(onAuthStateChanged);

    // 3. Unsubscribe from listener on component unmount
    return subscriber; 
  }, []);

  function onAuthStateChanged(firebaseUser) {
    setUser(firebaseUser);
    if (initializing) {
      setInitializing(false);
    }
  }

  // Function to handle Google Sign-in button press
  const onGoogleButtonPress = async () => {
    try {
      // 1. Check if Google Play Services are available (Android specific, but good practice)
      // This will automatically show a dialog to the user if services are missing/outdated
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // 2. Get the user's ID token from Google Sign-in
      const signInResult = await GoogleSignin.signIn();
      
      // Determine idToken based on documentation (v13+ data property first)
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        // Fallback for older versions or different result structure
        idToken = signInResult.idToken; 
      }

      if (!idToken) {
        throw new Error('Google Sign-in did not return an ID token.');
      }

      // 3. Create a Google credential with the ID token
      // GoogleAuthProvider is imported from '@react-native-firebase/auth'
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // 4. Sign-in the user to Firebase using the Google credential
      await firebaseAuth.signInWithCredential(googleCredential);
      Alert.alert('Success', 'Signed in with Google and Firebase!');

    } catch (error: any) { // Use 'any' type for flexible error handling
      console.error("Google Sign-in Error:", error);

      // Robust error handling to catch various types of errors
      if (error && typeof error === 'object') {
        if (error.code) { // Check if 'code' property exists on the error object
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            Alert.alert('Sign In Cancelled', 'You cancelled the Google Sign-in process.');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            Alert.alert('Sign In In Progress', 'Google Sign-in is already in progress.');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            Alert.alert('Play Services Not Available', 'Google Play Services are not available or outdated. Please update them.');
          } else if (error.code === 'auth/developer-error') {
            // This is often due to missing/incorrect SHA-1 fingerprint for Android or wrong Web Client ID
            Alert.alert('Configuration Error', 'DEVELOPER_ERROR: Check your SHA-1 fingerprint AND Web Client ID in Firebase/Google Cloud Console.');
          } else {
            // General error from Google Sign-in or Firebase Auth with a known code
            Alert.alert('Sign In Failed', `An unexpected error occurred: ${error.message || 'Unknown error'}`);
          }
        } else {
          // Error is an object but doesn't have a 'code' property
          Alert.alert('Sign In Failed', `An unexpected error occurred. Details: ${JSON.stringify(error)}`);
        }
      } else {
        // Error is not an object (e.g., null, undefined, or a string)
        Alert.alert('Sign In Failed', `An entirely unexpected error occurred: ${error ? String(error) : 'Unknown'}`);
      }
    }
  };

  // Function to handle Sign Out
  const signOut = async () => {
    try {
      // 1. Optional: Revoke Google access token (removes app's consent from Google)
      await GoogleSignin.revokeAccess(); 
      // 2. Sign out from Google (local SDK state)
      await GoogleSignin.signOut();      
      // 3. Sign out from Firebase Authentication using the modular auth instance
      await firebaseAuth.signOut();            

      Alert.alert('Signed Out', 'You have successfully signed out.');
      console.log('User signed out from Google and Firebase.');
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      Alert.alert('Sign Out Failed', `An error occurred during sign out: ${error.message || 'Unknown error'}`);
    }
  };

  // Show a loading indicator while Firebase initializes
  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.statusText}>Initializing Firebase...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sign-In with Firebase</Text>

      {user ? (
        // User is signed in: Display user info and Sign Out button
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>Welcome, {user.displayName || user.email || 'User'}!</Text>
          <Text style={styles.emailText}>UID: {user.uid}</Text>
          {user.email && <Text style={styles.emailText}>Email: {user.email}</Text>}
          {user.photoURL && (
            <Text style={styles.photoText} numberOfLines={1} ellipsizeMode="tail">
              Photo URL: {user.photoURL}
            </Text>
          )}
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // User is not signed in: Display Google Sign-in button
        <View>
          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={onGoogleButtonPress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  googleButton: {
    width: 220, // Adjust width as needed
    height: 60, // Adjust height as needed
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#d32f2f', // Red color for sign out
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  photoText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    width: '90%', // To prevent text from spilling
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
