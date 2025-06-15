import { Image, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect } from 'react';
import WrapperContainer from '../../components/WrapperContainerComp';
import LottieView from 'lottie-react-native';
import { storage } from '../../utils/storage';
import axios from 'axios';

import Constants, { Colors, API_GRAPHQL_ENDPOINT } from '../../utils/Constants';
import { moderateScale, textScale, screenWidth } from '../../utils/Scaling';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { replace } from '../../utils/NavigationUtils';

import { GET_PROFILE_DETAILS_QUERY } from '../../utils/mutation';

// Import useProfile hook
import { useProfile } from '../../context/ProfileContext'; // Adjust path as needed

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
    profileImage?: string; // Add profileImage to your type definition if it comes from the backend
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

type SuccessScreenProp = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SuccessScreen'>;
};

const SuccessScreen: React.FC<SuccessScreenProp> = ({ navigation }) => {
    // Use the useProfile hook to get setProfileImage
    const { setProfileImage } = useProfile();

    useEffect(() => {
        const handleNavigationAndProfileFetch = async () => {
            const isProfileCompleted = storage.getString('isProfileCompleted');
            const userId = storage.getString('userId');
            const accessToken = storage.getString('accessToken');

            console.log('MMKV: isProfileCompleted status on SuccessScreen:', isProfileCompleted);
            console.log('MMKV: userId on SuccessScreen:', userId);

            if (isProfileCompleted && userId && accessToken) {
                console.log('Profile is marked completed. Attempting to fetch/refresh full details...');
                try {
                    const profileResponse = await axios.post<GraphQLResponse>(
                        API_GRAPHQL_ENDPOINT,
                        {
                            query: GET_PROFILE_DETAILS_QUERY,
                            variables: { userId: userId },
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );

                    const profileResult = profileResponse.data;
                    console.log('Profile Details Response from SuccessScreen:', profileResult);

                    if (profileResult.data && profileResult.data.getProfileDetails) {
                        const profileData = profileResult.data.getProfileDetails;
                        for (const key in profileData) {
                            if (Object.prototype.hasOwnProperty.call(profileData, key)) {
                                const value = profileData[key as keyof ProfileDetailsType];
                                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                                    storage.set(key, String(value));
                                } else if (value !== null && typeof value === 'object') {
                                    storage.set(key, JSON.stringify(value));
                                }
                            }
                        }

                        // --- Set profile image in context and MMKV ---
                        if (profileData.profileImage) {
                            setProfileImage(profileData.profileImage); // Set in context
                            storage.set('profileImage', profileData.profileImage); // Ensure it's stored in MMKV as well
                            console.log('Profile image set in context and MMKV:', profileData.profileImage);
                        }
                        // --- End of profile image setting ---

                        storage.set('isProfileCompleted', true);
                        console.log('Full profile details saved/refreshed to MMKV from SuccessScreen!');
                        replace('Parent');
                    } else if (profileResult.errors && profileResult.errors.length > 0) {
                        const errorMessage = profileResult.errors[0].message;
                        console.error('Error fetching profile details on SuccessScreen:', errorMessage);

                        if (errorMessage.toLowerCase().includes('profile not found')) {
                            console.log('Backend confirmed profile not found. Correcting isProfileCompleted to false and navigating to CreateProfileUpdateScreen.');
                            storage.set('isProfileCompleted', false);
                            replace('CreateProfileScreen');
                        } else {
                            replace('Parent');
                        }
                    } else {
                        console.log('Profile data was null or empty from backend. Correcting isProfileCompleted to false and navigating to CreateProfileUpdateScreen.');
                        Alert.alert('Profile Not Found', 'Your profile details could not be loaded. Please complete your profile.');
                        storage.set('isProfileCompleted', false);
                        replace('CreateProfileUpdateScreen');
                    }
                } catch (profileFetchError: any) {
                    console.error('Network or unexpected error fetching profile details on SuccessScreen:', profileFetchError);
                    Alert.alert('Network Error');
                    replace('Parent');
                }
            } else {
                console.log('Profile not marked completed, or missing user/token data. Navigating to CreateProfileUpdateScreen.');
                replace('CreateProfileUpdateScreen');
            }
        };

        const timer = setTimeout(() => {
            handleNavigationAndProfileFetch();
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation, setProfileImage]); // Add setProfileImage to the dependency array

    return (
        <WrapperContainer>
            <View style={styles.containerView}>
                <LottieView
                    source={require('../../assets/animation/authenticaton.json')}
                    autoPlay
                    loop={false}
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