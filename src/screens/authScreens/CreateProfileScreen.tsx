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
import CustomCheckbox from '../../components/CustomCheckbox'; // Removed: Remember Me checkbox is gone

// Import reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

// Import MMKV storage utility
import { storage } from '../../utils/storage'; // <--- ASSUMPTION: Adjust path to your MMKV storage instance

const { width, height } = Dimensions.get('window');

interface Option {
  label: string;
  value: string;
}

// Assuming Props from navigation
import { RootStackParamList } from '../../navigation/types';
import { replace } from '../../utils/NavigationUtils';
import { MMKV } from 'react-native-mmkv';



const CreateProfileScreen: React.FC = ({  }) => {
  const [salutation, setSalutation] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [UserId, setUserId] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [whatsAppSameAsMobile, setWhatsAppSameAsMobile] = useState<boolean>(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // Will be auto-populated

  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const [residenceCity, setResidenceCity] = useState<string>('');
  const [education, setEducation] = useState<string | null>(null); // Changed to allow null for dropdown
  const [customEducation, setCustomEducation] = useState<string>(''); // For 'Other' education input
  const [collegeName, setCollegeName] = useState<string>('');
  const [collegeCityVillage, setCollegeCityVillage] = useState<string>('');

  // const [rememberMe, setRememberMe] = useState<boolean>(false); // REMOVED: Remember Me field
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  // Shared values for each animated input field
  const translateXResidenceCity = useSharedValue(width);
  const translateXEducation = useSharedValue(width);
  const translateXCollegeName = useSharedValue(width);
  const translateXCollegeCityVillage = useSharedValue(width);

  const [showAdditionalFields, setShowAdditionalFields] = useState<boolean>(false);

  // Auto-populate email from MMKV on component mount
 useEffect(() => {
    const storedEmail = storage.getString('userEmail'); 
    const storedUserId  = storage.getString('userId'); 
    console.log("Email from MMKV:", storedEmail); // Changed console log message for clarity
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);



  // Function to check if all initial fields are filled
  const areInitialFieldsFilled = (): boolean => {
    return (
      !!salutation &&
      !!firstName &&
      !!lastName &&
      !!mobileNo &&
      mobileNo.length === 10 && // Check mobile number length
      !!whatsAppNumber &&
      whatsAppNumber.length === 10 && // Check WhatsApp number length
      !!email &&
      !!dateOfBirth &&
      !!selectedGender
    );
  };

  // Effect to trigger animation when initial fields are filled
  useEffect(() => {
    if (areInitialFieldsFilled()) {
      setShowAdditionalFields(true);

      const animationDuration = 500;
      const delayBetweenFields = 150;

      translateXResidenceCity.value = withDelay(
        0,
        withTiming(0, { duration: animationDuration })
      );
      translateXEducation.value = withDelay(
        delayBetweenFields,
        withTiming(0, { duration: animationDuration })
      );
      translateXCollegeName.value = withDelay(
        delayBetweenFields * 2,
        withTiming(0, { duration: animationDuration })
      );
      translateXCollegeCityVillage.value = withDelay(
        delayBetweenFields * 3,
        withTiming(0, { duration: animationDuration })
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
  ]);

  // Animated styles for each input field
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
      today.getDate()
    );

    if (date > eighteenYearsAgo) {
      Alert.alert(
        'Age Restriction',
        'You must be at least 18 years old to create a profile.'
      );
      setDateOfBirth(''); // Clear the date of birth if it's invalid
      hideDatePicker();
      return;
    }

    // Format the date to 'YYYY-MM-DD' for consistency with backend
    setDateOfBirth(date.toLocaleDateString('en-CA'));
    hideDatePicker();
  };

  // Auto-populate WhatsApp number if checkbox is checked
  useEffect(() => {
    if (whatsAppSameAsMobile) {
      setWhatsAppNumber(mobileNo);
    } else {
      if (whatsAppNumber === mobileNo) {
        // Only clear if it was auto-populated from mobileNo
        setWhatsAppNumber('');
      }
    }
  }, [whatsAppSameAsMobile, mobileNo]);

  const handleSignUp = async (): Promise<void> => {
    // --- Input Validation ---

    // Name validation: no digits, at least 2 characters
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(firstName)) {
      Alert.alert('Invalid First Name', 'First Name must contain only letters and spaces, and be at least 2 characters long.');
      return;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert('Invalid Last Name', 'Last Name must contain only letters and spaces, and be at least 2 characters long.');
      return;
    }

    // Mobile Number validation: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobileNo)) {
      Alert.alert('Invalid Mobile Number', 'Mobile Number must be exactly 10 digits.');
      return;
    }
    if (!phoneRegex.test(whatsAppNumber)) {
      Alert.alert('Invalid WhatsApp Number', 'WhatsApp Number must be exactly 10 digits.');
      return;
    }

    // Basic validation for initial fields
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

    // Check if additional fields are shown and filled
    if (showAdditionalFields) {
      const finalEducation = education === 'Other' ? customEducation : education;
      if (
        !residenceCity ||
        !finalEducation || // Use the final education value
        !collegeName ||
        !collegeCityVillage
      ) {
        Alert.alert('Missing Information', 'Please fill in all the required additional fields.');
        return;
      }
    }


    // Age validation check again in case dateOfBirth was manually changed or if someone bypassed the date picker.
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      if (dob > eighteenYearsAgo) {
        Alert.alert(
          'Age Restriction',
          'You must be at least 18 years old to create a profile.'
        );
        return;
      }
    }

  const userId = storage.getString('userId'); // Corrected: Get uid from MMKV based on your MMKV data
    if (!userId) {
      Alert.alert('Authentication Error', 'User ID not found. Please log in again.');
      return;
    }

    
    // Determine the education value to send
    const finalEducationValue = education === 'Other' ? customEducation : education;


    // GraphQL Mutation for ProfileDetails
    const CREATE_PROFILE_MUTATION = `
      mutation CreateOrUpdateProfileDetails($input: CreateProfileDetailsInput!) {
        createOrUpdateProfileDetails(input: $input) {
        
          userId
          salutation
          firstName
          lastName
          mobileNo
          whatsAppNumber
          email
          dateOfBirth
          gender
          residenceCity
          education
          collegeName
          collegeCityVillage
          createdAt
        }
      }
    `;

    const variables = {
      input: {
        userId: userId, // Ensure this userId corresponds to a user in your system
        salutation: salutation,
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNo,
        whatsAppNumber: whatsAppNumber,
        email: email,
        dateOfBirth: dateOfBirth, // This string will be parsed to Date on backend
        gender: selectedGender,
        residenceCity: residenceCity,
        education: finalEducationValue, // Use the determined education value
        collegeName: collegeName,
        collegeCityVillage: collegeCityVillage,
        // rememberMe: rememberMe, // REMOVED: rememberMe field
      },
    };

    console.log('Sending data:', variables);

    try {
      const response = await fetch('http://192.168.103.188:3000/graphql', {
        // Your GraphQL endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Include if authentication is required
        },
        body: JSON.stringify({
          query: CREATE_PROFILE_MUTATION,
          variables: variables,
          operationName: 'CreateOrUpdateProfileDetails', // Ensure operationName matches the mutation name
        }),
      });

      const responseData = await response.json();
      console.log('Backend response:', responseData);

      if (response.ok && !responseData.errors) {
        Alert.alert('Success', 'Profile created/updated successfully!');
        replace('ProfileSuccessfulScreen');

      } else {
        const errorMessage = responseData.errors
          ? responseData.errors[0].message
          : 'Something went wrong.';
        Alert.alert('Operation Failed', errorMessage);
      }
    } catch (error) {
      console.error('Error during profile creation/update:', error);
      Alert.alert(
        'Error',
        'Network error. Please check your internet connection and backend server.'
      );
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
    { label: 'Other', value: 'Other' }, // Added "Other" option
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Adjust offset as needed
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
              maxLength={10} // Enforce 10 digits
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
              maxLength={10} // Enforce 10 digits
              editable={!whatsAppSameAsMobile}
            />
            <CustomTextInput
              iconLeft="email-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false} // <--- Email is not editable
              style={{ backgroundColor: '#f0f0f0' }} // Optional: visually indicate non-editable
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
              maximumDate={new Date()} // Prevent selecting future dates
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
                  <DropdownComponent // <--- Changed to DropdownComponent
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
    fontSize: width * 0.08,
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
    marginTop: -height * 0.01, // Adjust margin to visually align with dropdown
    marginBottom: height * 0.02,
  }
});

export default CreateProfileScreen;