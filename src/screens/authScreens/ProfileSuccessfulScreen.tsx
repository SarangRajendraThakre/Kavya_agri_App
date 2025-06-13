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

type ProfileSuccessfulScreenProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileSuccessfulScreen'>;
};

const ProfileSuccessfulScreen: React.FC<ProfileSuccessfulScreenProp> = ({ navigation }) => {
  useEffect(() => {
    const fetchAndStoreProfileDetails = async () => {
      // Retrieve userId and accessToken from MMKV
      const userId = storage.getString('userId');
      const accessToken = storage.getString('accessToken');

      if (!userId) {
        console.error('ProfileSuccessfulScreen: userId not found in MMKV.');
        replace('Parent'); // Fallback to Parent or Login
        return;
      }
      if (!accessToken) {
        console.error('ProfileSuccessfulScreen: accessToken not found in MMKV.');
        replace('LoginScreen'); // Direct to login if token is missing
        return;
      }

      console.log('ProfileSuccessfulScreen: Attempting to fetch full profile details...');
      try {
        const profileResponse = await axios.post(
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
        console.log('Profile Details Response from ProfileSuccessfulScreen:', profileResult);

        if (profileResult.data && profileResult.data.getProfileDetails) {
          const profileData = profileResult.data.getProfileDetails;
          // Store all profile fields in MMKV
          for (const key in profileData) {
            if (Object.prototype.hasOwnProperty.call(profileData, key)) {
              // MMKV can directly store strings, numbers, booleans.
              // For complex objects/arrays, JSON.stringify() is needed, but assuming primitive for profile fields.
              storage.set(key, profileData[key]);
            }
          }
          // Also set isProfileCompleted to true here, if it wasn't already (e.g., after a new profile creation)
          storage.set('isProfileCompleted', true);
          console.log('Full profile details and isProfileCompleted=true saved to MMKV from ProfileSuccessfulScreen!');
          replace('Parent'); // Navigate after successful fetch and storage
        } else if (profileResult.errors) {
          console.error('Error fetching profile details on ProfileSuccessfulScreen:', profileResult.errors[0].message);
          replace('Parent'); // Proceed to main app even with error
        }
      } catch (profileFetchError: any) {
        console.error('Network error fetching profile details on ProfileSuccessfulScreen:', profileFetchError);
        replace('Parent'); // Proceed to main app even with error
      }
    };

    // Set a timeout to delay the fetch and navigation, allowing animation to play
    const timer = setTimeout(() => {
      fetchAndStoreProfileDetails();
    }, 2000); // 2 seconds delay

    // Clear the timeout if the component unmounts before navigation
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <WrapperContainer>
      <View style={styles.containerView}>
        <LottieView
          source={require('../../assets/animation/ProfileSuccessful.json')} // Adjust the path to your Lottie JSON file
          autoPlay
          loop={false}
          style={styles.lottieAnimation}
        />
        {/* You can add text here like "Profile Updated Successfully!" if you want */}
        <Text style={styles.successTextStyle}>Profile Updated!</Text>
        <Text style={styles.congratulationTextStyle}>
          Your profile has been successfully updated.
        </Text>
      </View>
    </WrapperContainer>
  );
};

export default ProfileSuccessfulScreen;

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