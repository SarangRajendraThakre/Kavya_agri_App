// src/screens/CreateProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropdownComponent from '../../components/DropdownComponent';
import CustomTextInput from '../../components/CustomTextInput';
import CustomCheckbox from '../../components/CustomCheckbox';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import { storage } from '../../utils/storage';
import axios from 'axios';

import { replace } from '../../utils/NavigationUtils';
// Import BOTH mutations
import { CREATE_PROFILE_MUTATION, MARK_PROFILE_COMPLETED_MUTATION } from '../../utils/mutation';
import { API_GRAPHQL_ENDPOINT } from '../../utils/Constants';

const { width, height } = Dimensions.get('window');

interface Option {
  label: string;
  value: string;
}

const CreateProfileScreen: React.FC = ({}) => {
  const [salutation, setSalutation] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [UserId, setUserId] = useState<string>(''); // Used as appId/handle
  const [mobileNo, setMobileNo] = useState<string>('');
  const [whatsAppSameAsMobile, setWhatsAppSameAsMobile] = useState<boolean>(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // Will be auto-populated

  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const [residenceCity, setResidenceCity] = useState<string>('');
  const [education, setEducation] = useState<string | null>(null);
  const [customEducation, setCustomEducation] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('');
  const [collegeCityVillage, setCollegeCityVillage] = useState<string>('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  const translateXResidenceCity = useSharedValue(width);
  const translateXEducation = useSharedValue(width);
  const translateXCollegeName = useSharedValue(width); // Corrected: Must be a const
 const  translateXCollegeCityVillage = useSharedValue(width); // Corrected: Must be a const


  const [showAdditionalFields, setShowAdditionalFields] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = storage.getString('userEmail');
    const storedUserId = storage.getString('userId'); // This is your unique identifier for the user
    console.log('Email from MMKV:', storedEmail);
    console.log('UserId from MMKV:', storedUserId);
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const areInitialFieldsFilled = (): boolean => {
    return (
      !!salutation &&
      !!firstName &&
      !!lastName &&
      !!mobileNo &&
      mobileNo.length === 10 &&
      !!whatsAppNumber &&
      whatsAppNumber.length === 10 &&
      !!email &&
      !!dateOfBirth &&
      !!selectedGender
    );
  };

  useEffect(() => {
    if (areInitialFieldsFilled()) {
      setShowAdditionalFields(true);

      const animationDuration = 500;
      const delayBetweenFields = 150;

      translateXResidenceCity.value = withDelay(
        0,
        withTiming(0, { duration: animationDuration }),
      );
      translateXEducation.value = withDelay(
        delayBetweenFields,
        withTiming(0, { duration: animationDuration }),
      );
      translateXCollegeName.value = withDelay(
        delayBetweenFields * 2,
        withTiming(0, { duration: animationDuration }),
      );
      translateXCollegeCityVillage.value = withDelay(
        delayBetweenFields * 3,
        withTiming(0, { duration: animationDuration }),
      );
    } else {
      setShowAdditionalFields(false);
      translateXResidenceCity.value = width;
      translateXEducation.value = width;
      translateXCollegeName.value = width;
      translateXCollegeCityVillage.value = width;
    }
  }, [
    salutation,
    firstName,
    lastName,
    mobileNo,
    whatsAppNumber,
    email,
    dateOfBirth,
    selectedGender,
    // Add dependencies for animated values if they are used to control the animation state
    // For translateX, it's typically controlled by the `showAdditionalFields` state,
    // which in turn depends on the fields above.
    // If you add `translateXResidenceCity.value` here, it will trigger an infinite loop.
    // So, keep it as is, or control `showAdditionalFields` more directly.
  ]);

  const animatedResidenceCityStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXResidenceCity.value }],
    width: '100%',
  }));

  const animatedEducationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXEducation.value }],
    width: '100%',
  }));

  const animatedCollegeNameStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXCollegeName.value }],
    width: '100%',
  }));

  const animatedCollegeCityVillageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXCollegeCityVillage.value }],
    width: '100%',
  }));

  const showDatePicker = (): void => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = (): void => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date): void => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );

    if (date > eighteenYearsAgo) {
      Alert.alert(
        'Age Restriction',
        'You must be at least 18 years old to create a profile.',
      );
      setDateOfBirth('');
      hideDatePicker();
      return;
    }

    setDateOfBirth(date.toLocaleDateString('en-CA')); // YYYY-MM-DD format
    hideDatePicker();
  };

  useEffect(() => {
    if (whatsAppSameAsMobile) {
      setWhatsAppNumber(mobileNo);
    } else {
      // Only clear whatsAppNumber if it was previously set *because* it was same as mobile
      // and now the checkbox is unchecked. Avoid clearing if user manually entered a different number.
      if (whatsAppNumber === mobileNo) { // This check prevents clearing a manually entered different number
        setWhatsAppNumber('');
      }
    }
  }, [whatsAppSameAsMobile, mobileNo]); // Depend on whatsAppSameAsMobile and mobileNo

  const handleSignUp = async (): Promise<void> => {
    // --- Input Validation ---
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(firstName)) {
      Alert.alert(
        'Invalid First Name',
        'First Name must contain only letters and spaces, and be at least 2 characters long.',
      );
      return;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert(
        'Invalid Last Name',
        'Last Name must contain only letters and spaces, and be at least 2 characters long.',
      );
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobileNo)) {
      Alert.alert('Invalid Mobile Number', 'Mobile Number must be exactly 10 digits.');
      return;
    }
    if (whatsAppNumber && !phoneRegex.test(whatsAppNumber)) {
      Alert.alert('Invalid WhatsApp Number', 'WhatsApp Number must be exactly 10 digits.');
      return;
    }

    if (
      !salutation ||
      !firstName ||
      !lastName ||
      !mobileNo ||
      !whatsAppNumber ||
      !email ||
      !dateOfBirth ||
      !selectedGender
    ) {
      Alert.alert('Missing Information', 'Please fill in all the required initial fields.');
      return;
    }

    if (showAdditionalFields) {
      const finalEducation = education === 'Other' ? customEducation : education;
      if (
        !residenceCity ||
        !finalEducation ||
        !collegeName ||
        !collegeCityVillage
      ) {
        Alert.alert('Missing Information', 'Please fill in all the required additional fields.');
        return;
      }
    }

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      if (dob > eighteenYearsAgo) {
        Alert.alert(
          'Age Restriction',
          'You must be at least 18 years old to create a profile.'
        );
        return;
      }
    }

    if (!email) {
      Alert.alert('Authentication Error', 'User email not found. Please log in again.');
      return;
    }

    const finalEducationValue = education === 'Other' ? customEducation : education;

    const profileVariables = {
      input: {
        userId: UserId, // Pass the UserId obtained from MMKV
        salutation: salutation,
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNo,
        whatsAppNumber: whatsAppNumber,
        email: email, // This is the user's email ID
        dateOfBirth: dateOfBirth,
        gender: selectedGender,
        residenceCity: residenceCity,
        education: finalEducationValue,
        collegeName: collegeName,
        collegeCityVillage: collegeCityVillage,
      },
    };

    console.log('Sending profile data:', profileVariables);

    try {
      // 1. Call the mutation to create/update profile details
      const profileResponse = await axios.post(
        API_GRAPHQL_ENDPOINT,
        {
          query: CREATE_PROFILE_MUTATION,
          variables: profileVariables,
          operationName: 'CreateOrUpdateProfileDetails',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${storage.getString('authToken')}` // Uncomment if you have an auth token
          },
        },
      );

      console.log('Profile details backend response:', profileResponse.data);

      if (profileResponse.data.errors) {
        const errorMessage = profileResponse.data.errors[0]?.message
          ? profileResponse.data.errors[0].message
          : 'Failed to save profile details on the server.';
        Alert.alert('Profile Creation Failed', errorMessage);
        return; // Stop here if profile details save fails
      }

      // --- 2. If profile details are successfully saved, call the mutation to mark profile as completed ---
      const markCompletedResponse = await axios.post(
        API_GRAPHQL_ENDPOINT,
        {
          query: MARK_PROFILE_COMPLETED_MUTATION,
          variables: { emailId: email }, // Pass the user's email for this mutation
          operationName: 'MarkProfileAsCompleted',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${storage.getString('authToken')}` // Uncomment if you have an auth token
          },
        },
      );

      console.log('Mark profile as completed backend response:', markCompletedResponse.data);

      if (markCompletedResponse.data.errors) {
        console.error('Error marking profile as completed:', markCompletedResponse.data.errors[0]?.message);
        Alert.alert('Warning', 'Profile saved, but unable to mark as completed. Please contact support.');
      } else {
        const isProfileCompleted = markCompletedResponse.data.data.markProfileAsCompleted.user.isProfileCompleted;
        storage.set('isProfileCompleted', isProfileCompleted);
        console.log('Profile completion status saved to MMKV:', isProfileCompleted);

        // --- MMKV Storage Logic: Store firstName, lastName, and UserId separately ---
        // This runs ONLY if both backend operations are successful (or the second one warns but doesn't fail critically)
        storage.set('firstName', firstName);
        storage.set('lastName', lastName);
        storage.set('appId', UserId);   
        
        console.log('User profile data stored in MMKV:', {
          firstName,
          lastName,
          appId: UserId,
        });
      }

      // Navigate to success screen after all operations
      replace('ProfileSuccessfulScreen');

    } catch (error: any) {
      console.error('Error during profile process:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server response error:', error.response.data);
          Alert.alert(
            'Operation Failed',
            error.response.data.errors?.[0]?.message || 'Server responded with an error.'
          );
        } else if (error.request) {
          console.error('No response received:', error.request);
          Alert.alert(
            'Error',
            'No response from server. Please check your network and server status.'
          );
        } else {
          console.error('Axios setup error:', error.message);
          Alert.alert(
            'Error',
            'Request setup failed: ' + error.message
          );
        }
      } else {
        Alert.alert(
          'Error',
          'An unexpected error occurred: ' + error.message
        );
      }
    }
  };

  const genderOptions: Option[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const salutationOptions: Option[] = [
    { label: 'Mr.', value: 'mr' },
    { label: 'Ms.', value: 'ms' },
    { label: 'Mrs.', value: 'mrs' },
  ];

  const educationOptions: Option[] = [
    { label: 'B.Sc. Agriculture', value: 'B.Sc. Agriculture' },
    { label: 'M.Sc. Agriculture', value: 'M.Sc. Agriculture' },
    { label: 'Ph.D. Agriculture', value: 'Ph.D. Agriculture' },
    { label: 'B.Tech. Agricultural Engineering', value: 'B.Tech. Agricultural Engineering' },
    { label: 'Diploma in Agriculture', value: 'Diploma in Agriculture' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <ImageBackground
      // source={require('./assets/background-wave.png')} // Uncomment and provide actual image path
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Create Profile</Text>
            <Text style={styles.subHeaderText}>Fill the Details As per ID Proof</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Salutation Dropdown */}
            <DropdownComponent
              data={salutationOptions}
              placeholder="Salutation"
              value={salutation}
              onSelect={setSalutation}
              icon="account-circle-outline"
              searchable={false}
            />

            {/* First Name and Last Name side-by-side */}
            <View style={styles.nameInputContainer}>
              <CustomTextInput
                iconLeft="account-outline"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                containerStyle={styles.halfInput}
              />
              <CustomTextInput
                iconLeft="account-outline"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                containerStyle={styles.halfInput}
              />
            </View>

            <CustomTextInput
              iconLeft="phone-outline"
              placeholder="Mobile No"
              value={mobileNo}
              onChangeText={setMobileNo}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <CustomCheckbox
              label="WhatsApp number same as Mobile No"
              checked={whatsAppSameAsMobile}
              onPress={() => setWhatsAppSameAsMobile(!whatsAppSameAsMobile)}
            />
            <CustomTextInput
              iconLeft="whatsapp"
              placeholder="WhatsApp Number"
              value={whatsAppNumber}
              onChangeText={setWhatsAppNumber}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!whatsAppSameAsMobile}
            />
            <CustomTextInput
              iconLeft="email-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
              style={{ backgroundColor: '#f0f0f0' }}
            />

            {/* Date of Birth Input */}
            <TouchableOpacity onPress={showDatePicker} style={styles.dateInputWrapper}>
              <CustomTextInput
                iconLeft="calendar"
                placeholder="Date of Birth"
                value={dateOfBirth}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              maximumDate={new Date()}
            />

            {/* Gender Dropdown */}
            <DropdownComponent
              data={genderOptions}
              placeholder="Select Gender"
              value={selectedGender}
              onSelect={setSelectedGender}
              icon="gender-male-female"
              searchable={false}
            />

            {/* Animated Individual Fields */}
            {showAdditionalFields && (
              <>
                <Animated.View style={animatedResidenceCityStyle}>
                  <CustomTextInput
                    iconLeft="city-variant-outline"
                    placeholder="Residence City"
                    value={residenceCity}
                    onChangeText={setResidenceCity}
                  />
                </Animated.View>
                <Animated.View style={animatedEducationStyle}>
                  <DropdownComponent
                    data={educationOptions}
                    placeholder="Education"
                    value={education}
                    onSelect={setEducation}
                    icon="school-outline"
                    searchable={true}
                  />
                </Animated.View>
                {/* Conditionally render custom education input */}
                {education === 'Other' && (
                  <Animated.View style={animatedEducationStyle}>
                    <CustomTextInput
                      iconLeft="school-outline"
                      placeholder="Specify your Education"
                      value={customEducation}
                      onChangeText={setCustomEducation}
                      containerStyle={styles.customEducationInput}
                    />
                  </Animated.View>
                )}
                <Animated.View style={animatedCollegeNameStyle}>
                  <CustomTextInput
                    iconLeft="office-building-outline"
                    placeholder="College Name"
                    value={collegeName}
                    onChangeText={setCollegeName}
                  />
                </Animated.View>
                <Animated.View style={animatedCollegeCityVillageStyle}>
                  <CustomTextInput
                    iconLeft="map-marker-outline"
                    placeholder="College City/Village"
                    value={collegeCityVillage}
                    onChangeText={setCollegeCityVillage}
                  />
                </Animated.View>
              </>
            )}

            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
              <Text style={styles.loginButtonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: height * 0.02,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  welcomeText: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    color: '#000',
    marginTop: height * 0.02,
    marginBottom: height * 0.005,
  },
  subHeaderText: {
    fontSize: width * 0.04,
    color: '#000',
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: width * 0.07,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  halfInput: {
    width: '48%',
  },
  dateInputWrapper: {
    marginBottom: height * 0.02,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  forgotPasswordText: {
    fontSize: width * 0.035,
    color: '#888',
  },
  loginButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: width * 0.025,
    color: '#888',
    fontSize: width * 0.035,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.02,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    width: '48%',
    justifyContent: 'center',
  },
  socialIcon: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.025,
  },
  socialButtonText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.025,
    backgroundColor: '#1E1E1E',
  },
  signUpText: {
    color: '#DDD',
    fontSize: width * 0.038,
  },
  signUpLink: {
    color: '#6A5ACD',
    fontSize: width * 0.038,
    fontWeight: 'bold',
  },
  customEducationInput: {
    marginTop: -height * 0.01,
    marginBottom: height * 0.02,
  }
});

export default CreateProfileScreen;