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
import { storage } from '../utils/storage'; // Import MMKV storage instance
import { navigate, replace } from '../utils/NavigationUtils';
import { BACKEND_API_URL } from '../utils/Constants';

// --- IMPORTANT: Replace with your actual Web Client ID from Firebase ---
const WEB_CLIENT_ID = '248628718653-g37462gv6b5n2ks3unindsqgh8r7cpaq.apps.googleusercontent.com';




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

    // Define the type for the user data sent to the backend
    interface BackendUserData {
        f_uid: string; // The Firebase User ID (unique identifier for the user)
        email: string | null;
        displayName: string | null; // User's display name
        photoURL: string | null;     // User's photo URL
        idToken: string;             // Google's ID Token (optional for backend if Firebase ID Token is used)
        firebaseAccessToken: string; // The Firebase ID Token (for backend verification)
    }

    // Define the type for the expected backend response (based on your console log)
    interface BackendUserResponse {
        accessToken: string;
        appId: string;
        emailId: string;
        message: string;
        refreshToken: string;
        role: string;
        userId: string; // This is the MongoDB _id from your backend
        isProfileCompleted:boolean;
    }

    const sendUserDataToBackend = async (userData: BackendUserData) => {
        try {
            console.log('Sending user data to backend:', BACKEND_API_URL, {
                email: userData.email,
            });

            const response = await fetch(BACKEND_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.firebaseAccessToken}`,
                },
                body: JSON.stringify({
                    email: userData.email,
                }),
            });

            console.log('Backend HTTP response object:', response);

            if (response.ok) {
                // If successful, assume JSON and parse it
                const responseData: BackendUserResponse = await response.json();
                console.log('Backend response (user creation/login & MMKV storage):', responseData);

                // --- Store received data in MMKV ---
                // Ensure values exist and are of string type before storing
                if (typeof responseData.emailId === 'string') {
                    storage.set('userEmail', responseData.emailId);
                    console.log('MMKV Stored: userEmail =', responseData.emailId);
                }
                if (typeof responseData.userId === 'string') { // This is the MongoDB _id
                    storage.set('userId', responseData.userId);
                    console.log('MMKV Stored: userId =', responseData.userId);
                }
                if (typeof responseData.appId === 'string') { // This is your custom KAI- formatted ID
                    storage.set('appId', responseData.appId);
                    console.log('MMKV Stored: appId =', responseData.appId);
                }
                if (typeof responseData.role === 'string') {
                    storage.set('role', responseData.role);
                    console.log('MMKV Stored: role =', responseData.role);
                }
                if (typeof responseData.accessToken === 'string') {
                    storage.set('accessToken', responseData.accessToken);
                    console.log('MMKV Stored: accessToken =', responseData.accessToken);
                }
                if (typeof responseData.refreshToken === 'string') {
                    storage.set('refreshToken', responseData.refreshToken);
                    console.log('MMKV Stored: refreshToken =', responseData.refreshToken);
                }

                 if (typeof responseData.isProfileCompleted === 'boolean') {
                    // MMKV storage.set expects a string, so convert boolean to string
                    storage.set('isProfileCompleted', String(responseData.isProfileCompleted));
                    console.log('MMKV Stored: isProfileCompleted =', responseData.isProfileCompleted);
                }
            } else {
                // If response is not OK (e.g., 400, 500 status), try to parse error message
                const errorResponseData = await response.json().catch(() => null);
                console.error('Backend error response:', errorResponseData || `HTTP Status: ${response.status}`);
                throw new Error(errorResponseData?.message || `Backend returned status ${response.status}`);
            }

        } catch (error: any) {
            console.error('Error sending user data to backend:', error.message || error);
            Alert.alert('Backend Error', `Failed to sync user data: ${error.message || 'Unknown error'}`);
            throw error; // Re-throw to be caught by the outer onGoogleButtonPress handler
        }
    };

    const onGoogleButtonPress = async () => {
        setLoading(true);

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const signInResult = await GoogleSignin.signIn();

            // Prioritize signInResult.idToken directly as it's the primary way
            let idToken = signInResult.idToken;
            // Fallback for older versions or different data structures if needed
            if (!idToken && signInResult.data?.idToken) {
                idToken = signInResult.data.idToken;
            }

            if (!idToken) {
                throw new Error('Google Sign-in did not return an ID token.');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await firebaseAuth.signInWithCredential(googleCredential);

            // Get the Firebase ID Token (this is what your backend will primarily verify)
            const firebaseIdToken = await userCredential.user.getIdToken();

            console.log('Firebase User Credential:', userCredential);

            const userDataToStore: BackendUserData = {
                f_uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                photoURL: userCredential.user.photoURL,
                idToken: idToken,
                firebaseAccessToken: firebaseIdToken,
            };

            // Store Google Auth specific user data (optional, but good for debugging/caching)
            storage.set('googleAuthUserData', JSON.stringify(userDataToStore));
            console.log('Google Auth user data stored in MMKV:', userDataToStore);

            // --- IMPORTANT: AWAIT the backend call to ensure MMKV is populated ---
            await sendUserDataToBackend(userDataToStore);

            // Navigate AFTER backend communication and MMKV storage are complete
            // Alert.alert('Success', 'Signed in with Google and profile synced!');
            replace('SuccessScreen'); // Navigate to CreateProfileScreen to complete profile details

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
                } else if (error.message) {
                    Alert.alert('Sign In Failed', `An error occurred: ${error.message}`);
                } else {
                    Alert.alert('Sign In Failed', `An unexpected error occurred. Details: ${JSON.stringify(error)}`);
                }
            } else {
                Alert.alert('Sign In Failed', `An entirely unexpected error occurred: ${error ? String(error) : 'Unknown'}`);
            }
        } finally {
            setLoading(false);
        }
    };

  

  

  

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
        flexDirection: 'column',
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