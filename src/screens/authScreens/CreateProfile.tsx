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
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropdownComponent from '../../components/DropdownComponent';
import CustomTextInput from '../../components/CustomTextInput';
import CustomCheckbox from '../../components/CustomCheckbox';

// Import reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Option {
  label: string;
  value: string;
}

// Assuming Props from navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type SignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CreateProfile'>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [salutation, setSalutation] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [whatsAppSameAsMobile, setWhatsAppSameAsMobile] = useState<boolean>(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  // Removed password and confirmPassword as they were not in the snippet for this context
  // but if you have them in your full code, make sure to include them in areInitialFieldsFilled

  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const [residenceCity, setResidenceCity] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('');
  const [collegeCityVillage, setCollegeCityVillage] = useState<string>('');

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  // Shared values for each animated input field
  const translateXResidenceCity = useSharedValue(width);
  const translateXEducation = useSharedValue(width);
  const translateXCollegeName = useSharedValue(width);
  const translateXCollegeCityVillage = useSharedValue(width);

  const [showAdditionalFields, setShowAdditionalFields] = useState<boolean>(false);

  // Function to check if all initial fields are filled
  const areInitialFieldsFilled = (): boolean => {
    return (
      !!salutation && // Check salutation
      !!firstName &&
      !!lastName &&
      !!mobileNo &&
      !!whatsAppNumber &&
      !!email &&
      // !!password && // Include if password fields are part of initial
      // !!confirmPassword && // Include if password fields are part of initial
      !!dateOfBirth &&
      !!selectedGender
    );
  };

  // Effect to trigger animation when initial fields are filled
  useEffect(() => {
    if (areInitialFieldsFilled()) {
      setShowAdditionalFields(true);

      const animationDuration = 500; // Duration for each individual slide
      const delayBetweenFields = 150; // Delay between each subsequent field

      // Animate each field with a progressive delay
      translateXResidenceCity.value = withDelay(
        0, // No delay for the first field
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
      // Hide fields and reset their positions when criteria are not met
      // You might want to animate them out gracefully here if setShowAdditionalFields(false)
      // is not immediate
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
    // password, // Include if password fields are part of initial
    // confirmPassword, // Include if password fields are part of initial
    dateOfBirth,
    selectedGender,
  ]);

  // Animated styles for each input field
  const animatedResidenceCityStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXResidenceCity.value }],
    width: '100%', // Ensure it takes full width
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
    setDateOfBirth(date.toLocaleDateString()); // Format as desired
    hideDatePicker();
  };

  // Auto-populate WhatsApp number if checkbox is checked
  useEffect(() => {
    if (whatsAppSameAsMobile) {
      setWhatsAppNumber(mobileNo);
    } else {
      if (whatsAppNumber === mobileNo) {
        setWhatsAppNumber('');
      }
    }
  }, [whatsAppSameAsMobile, mobileNo]);

  const handleSignUp = async (): Promise<void> => {
    // Basic validation
    if (
      !salutation ||
      !firstName ||
      !lastName ||
      !mobileNo ||
      !whatsAppNumber ||
      !email ||
      // !password || // Include if password fields are part of initial
      // !confirmPassword || // Include if password fields are part of initial
      !dateOfBirth ||
      !selectedGender ||
      // Add validation for the dynamically revealed fields
      !residenceCity ||
      !education ||
      !collegeName ||
      !collegeCityVillage
    ) {
      Alert.alert('Missing Information', 'Please fill in all the required fields.');
      return;
    }

    // if (password !== confirmPassword) { // Include if password fields are part of initial
    //   Alert.alert('Password Mismatch', 'Password and Confirm Password do not match.');
    //   return;
    // }

    const userData = {
      salutation,
      firstName,
      lastName,
      mobileNo,
      whatsAppNumber,
      email,
      // password, // In a real app, hash this before sending to backend
      dateOfBirth,
      gender: selectedGender,
      residenceCity,
      education,
      collegeName,
      collegeCityVillage,
      rememberMe,
    };

    console.log('Signing Up with:', userData);

    // --- Backend API Call ---
    try {
      // Replace with your actual backend API endpoint
      const response = await fetch('YOUR_BACKEND_API_ENDPOINT/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', data.message || 'Account created successfully!');
        // Consider navigating to a success screen or login
        // navigation.navigate('LoginScreen');
      } else {
        const errorData = await response.json();
        Alert.alert('Sign Up Failed', errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Error', 'Network error. Please check your internet connection.');
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
    { label: 'Dr.', value: 'dr' },
  ];

  return (
    <ImageBackground
      // source={require('./assets/background-wave.png')} // Uncomment and provide actual image path
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="position"
        keyboardVerticalOffset={-200}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Create Profile</Text>
            <Text style={styles.subHeaderText}>Fill the Details As per ID Proof</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Salutation Dropdown - RE-ADDED */}
            <DropdownComponent
              data={salutationOptions}
              placeholder="Salutation"
              value={salutation}
              onSelect={setSalutation}
              icon="account-circle-outline"
              searchable={false} // Assuming no search needed for Salutation
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
              placeholder="Mobile No (auto-captured)"
              value={mobileNo}
              onChangeText={setMobileNo}
              keyboardType="phone-pad"
              editable={true} // Set to false if truly auto-captured and non-editable
            />
            <CustomCheckbox
              label="WhatsApp number same as Mobile No"
              checked={whatsAppSameAsMobile}
              onPress={() => setWhatsAppSameAsMobile(!whatsAppSameAsMobile)}
            />
            <CustomTextInput
              icon="whatsapp"
              placeholder="WhatsApp Number"
              value={whatsAppNumber}
              onChangeText={setWhatsAppNumber}
              keyboardType="phone-pad"
              editable={!whatsAppSameAsMobile}
            />
            <CustomTextInput
              icon="email-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
       

            {/* Date of Birth Input */}
            <TouchableOpacity onPress={showDatePicker} style={styles.dateInputWrapper}>
              <CustomTextInput
                icon="calendar"
                placeholder="Date of Birth"
                value={dateOfBirth}
                editable={false}
                pointerEvents="none" // Prevents the input from being directly typed into
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />

            {/* Gender Dropdown */}
            <DropdownComponent
              data={genderOptions}
              placeholder="Select Gender"
              value={selectedGender}
              onSelect={setSelectedGender}
              icon="gender-male-female"
              searchable={false} // Assuming no search needed for Gender
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
                  <CustomTextInput
                    iconLeft="school-outline"
                    placeholder="Education"
                    value={education}
                    onChangeText={setEducation}
                  />
                </Animated.View>
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

            {/* If you want the OR separator and social buttons, uncomment these */}
            {/*
            <View style={styles.orSeparator}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
            */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* If you want the "Already have an account?" section, uncomment this */}
      {/*
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signUpLink}>Login</Text>
        </TouchableOpacity>
      </View>
      */}
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
    color: '#FFF',
    marginTop: height * 0.02,
    marginBottom: height * 0.005,
  },
  subHeaderText: {
    fontSize: width * 0.04,
    color: '#DDD',
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
});

export default SignupScreen;