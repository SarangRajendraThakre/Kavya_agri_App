import { Image, StyleSheet, Text, View, Alert } from 'react-native'; // Added Alert for error handling
import React, { useEffect } from 'react';
import WrapperContainer from '../../components/WrapperContainerComp';
import LottieView from 'lottie-react-native';
import { storage } from '../../utils/storage'; // Import your MMKV storage instance
import axios from 'axios'; // Import Axios

import Constants, { Colors, API_GRAPHQL_ENDPOINT } from '../../utils/Constants'; // Ensure API_GRAPHQL_ENDPOINT is imported
import { moderateScale, textScale, screenWidth } from '../../utils/Scaling';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { replace } from '../../utils/NavigationUtils';

// Import the profile details query
import { GET_PROFILE_DETAILS_QUERY } from '../../utils/mutation'; // Adjust path if necessary

// --- Interface Definitions (Important for type safety with your GraphQL query) ---
interface ProfileDetailsType {
    id: string;
    userId: string;
    salutation: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
    whatsAppNumber: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    residenceCity: string;
    education: string;

    collegeName: string;
    collegeCityVillage: string;
    createdAt: string;
    updatedAt: string;
}

interface GraphQLResponse {
    data: {
        getProfileDetails: ProfileDetailsType;
    };
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
        extensions?: {
            code: string;
            [key: string]: any;
        };
    }>;
}
// --- End Interface Definitions ---

type SuccessScreenProp = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SuccessScreen'>;
};

const SuccessScreen: React.FC<SuccessScreenProp> = ({ navigation }) => {
    useEffect(() => {
        const handleNavigationAndProfileFetch = async () => {
            // Retrieve the profile completion status, userId, and accessToken from MMKV
            const isProfileCompleted = storage.getString('isProfileCompleted');
            const userId = storage.getString('userId'); // Get userId from MMKV
            const accessToken = storage.getString('accessToken'); // Get accessToken from MMKV
 
             console.log(userId);

            console.log(isProfileCompleted);
            // Ensure isProfileCompleted is a boolean, default to false if not found
       

            console.log('MMKV: isProfileCompleted status on SuccessScreen:', isProfileCompleted);
            console.log('MMKV: userId on SuccessScreen:', userId);
            // console.log('MMKV: accessToken on SuccessScreen:', accessToken ? 'Present' : 'Missing'); // Log presence only for security

            // If profile is marked as completed AND we have a userId and accessToken to perform the fetch
            if (isProfileCompleted && userId && accessToken) {
                console.log('Profile is marked completed. Attempting to fetch/refresh full details...');
                try {
                    const profileResponse = await axios.post<GraphQLResponse>(
                        API_GRAPHQL_ENDPOINT,
                        {
                            query: GET_PROFILE_DETAILS_QUERY,
                            variables: { userId: userId }, // Use the userId from MMKV
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`, // Use the accessToken from MMKV
                            },
                        },
                    );

                    const profileResult = profileResponse.data;
                    console.log('Profile Details Response from SuccessScreen:', profileResult);

                    if (profileResult.data && profileResult.data.getProfileDetails) {
                        const profileData = profileResult.data.getProfileDetails;
                        // Store all profile fields in MMKV individually
                        for (const key in profileData) {
                            if (Object.prototype.hasOwnProperty.call(profileData, key)) {
                                const value = profileData[key as keyof ProfileDetailsType]; // Type assertion for key safety
                                // MMKV's `set` method supports string, number, boolean. Stringify complex types.
                                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                                    storage.set(key, String(value)); // Store as string for consistency in MMKV
                                } else if (value !== null && typeof value === 'object') {
                                    // If a field might be an object/array, stringify it
                                    storage.set(key, JSON.stringify(value));
                                }
                            }
                        }
                        // Re-confirm isProfileCompleted and appId explicitly after successful fetch
                        storage.set('isProfileCompleted', true);
              

                        console.log('Full profile details saved/refreshed to MMKV from SuccessScreen!');
                        replace('Parent'); // Navigate after successful fetch and storage
                    } else if (profileResult.errors && profileResult.errors.length > 0) {
                        // Handle GraphQL errors
                        const errorMessage = profileResult.errors[0].message;
                        console.error('Error fetching profile details on SuccessScreen:', errorMessage);

                        // IMPORTANT: If backend says "Profile not found", correct local state and redirect to creation
                        if (errorMessage.toLowerCase().includes('profile not found')) {
                            console.log('Backend confirmed profile not found. Correcting isProfileCompleted to false and navigating to CreateProfileUpdateScreen.');
                            storage.set('isProfileCompleted', false); // Correct the MMKV state
                            replace('CreateProfileScreen'); // Redirect to create/update profile screen
                        } else {
                            // For other types of GraphQL errors (e.g., unauthorized, validation),
                            // you might choose to go to Parent (assuming partial functionality) or a more specific error screen.
                            // For this example, we'll assume other errors still lead to Parent, but you might want to adjust.
                            replace('Parent');
                        }
                    } else {
                        // Case where data is null but no specific errors (e.g., empty or unexpected response structure)
                        console.log('Profile data was null or empty from backend. Correcting isProfileCompleted to false and navigating to CreateProfileUpdateScreen.');
                        Alert.alert('Profile Not Found', 'Your profile details could not be loaded. Please complete your profile.');
                        storage.set('isProfileCompleted', false); // Correct the MMKV state
                        replace('CreateProfileUpdateScreen');
                    }
                } catch (profileFetchError: any) {
                    // Handle network errors or other unexpected exceptions
                    console.error('Network or unexpected error fetching profile details on SuccessScreen:', profileFetchError);
                    Alert.alert('Network Error');

                    // In case of network error, decide fallback:
                    // Option 1: Still go to Parent (e.g., hoping cached data is sufficient, or user can retry there)
                    replace('Parent');
                    // Option 2: Go to an error screen, or redirect to login
                    // Alert.alert("Error", "Could not load profile. Please check internet and retry.");
                    // navigation.replace('LoginScreen'); // Example fallback
                }
            } else {
                // If profile is NOT completed, or userId/accessToken are missing, navigate to CreateProfileUpdateScreen
                console.log('Profile not marked completed, or missing user/token data. Navigating to CreateProfileUpdateScreen.');
                replace('CreateProfileUpdateScreen');
            }
        };

        // Set a timeout to initiate the process after 2 seconds (2000 milliseconds)
        // This gives the user time to see the success animation
        const timer = setTimeout(() => {
            handleNavigationAndProfileFetch();
        }, 2000);

        // Clear the timeout if the component unmounts before navigation/fetch completes
        return () => clearTimeout(timer);
    }, [navigation]); // Depend on navigation prop

    return (
        <WrapperContainer>
            <View style={styles.containerView}>
                {/* Your Lottie Animation */}
                <LottieView
                    source={require('../../assets/animation/authenticaton.json')} // Adjust the path
                    autoPlay // Start playing automatically
                    loop={false} // Play only once
                    style={styles.lottieAnimation}
                />

                <Text style={styles.successTextStyle}>Success!</Text>
                <Text style={styles.congratulationTextStyle}>
                    Congratulations! You have been successfully authenticated
                </Text>
            </View>
        </WrapperContainer>
    );
};

export default SuccessScreen;

const styles = StyleSheet.create({
    containerView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    lottieAnimation: {
        width: moderateScale(200),
        height: moderateScale(200),
        marginBottom: moderateScale(16),
    },
    successTextStyle: {
        fontSize: textScale(22),
        fontWeight: '600',
        color: Colors.black,
    },
    congratulationTextStyle: {
        textAlign: 'center',
        marginTop: moderateScale(8),
        color: Colors.black60,
        fontSize: textScale(18),
        fontWeight: '500',
        marginBottom: moderateScale(77),
    },
});