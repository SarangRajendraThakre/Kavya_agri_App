import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ImageSourcePropType,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import DateTimePickerModal
import axios from 'axios'; // Ensure Axios is imported

import {
  fontR,
  scale,
  verticalScale,
  moderateScale,
  moderateScaleVertical,
  screenWidth,
} from '../utils/Scaling';

import CustomCheckbox from '../components/CustomCheckbox'; // Assuming this exists
import { storage } from '../utils/storage'; // Assuming MMKV storage is set up
import { API_GRAPHQL_ENDPOINT } from '../utils/Constants'; // Your GraphQL endpoint
import { CREATE_PROFILE_MUTATION, GET_PROFILE_QUERY } from '../utils/mutation'; // Your GraphQL queries
import { goBack } from '../utils/NavigationUtils'; // Your navigation utility
import CustomTextInput from '../components/CustomTextInput'; // Your CustomTextInput component
import DropdownComponent from '../components/DropdownComponent'; // Your DropdownComponent

const { width, height } = Dimensions.get('window');

interface Option {
  label: string;
  value: string;
}

// Minimal type for profile data received from API
interface ProfileData {
  id: string;
  userId: string;
  salutation: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  whatsAppNumber: string;
  email: string;
  dateOfBirth: string; // Assuming 'YYYY-MM-DD' string
  gender: string;
  residenceCity: string;
  education: string;
  collegeName: string;
  collegeCityVillage: string;
  profileImageUrl?: string;
  createdAt: string; // Add these as they are in your GraphQL type
  updatedAt: string; // Add these as they are in your GraphQL type
}

const EditProfileScreen: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Profile data states - initialized to empty or null
  const [salutation, setSalutation] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [whatsAppSameAsMobile, setWhatsAppSameAsMobile] = useState<boolean>(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // Email is usually read-only
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [residenceCity, setResidenceCity] = useState<string>('');
  const [education, setEducation] = useState<string | null>(null);
  const [customEducation, setCustomEducation] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('');
  const [collegeCityVillage, setCollegeCityVillage] = useState<string>('');

  const [profileImage, setProfileImage] = useState<ImageSourcePropType>({
    uri: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE',
  });

  const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  // --- useEffect for fetching initial profile data ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const userId = storage.getString('userId');
      const userEmail = storage.getString('userEmail'); // Get userEmail from storage

      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        setLoading(false);
        // Consider navigating to login/onboarding if userId is crucial and missing
        return;
      }

      // Pre-fill email from storage, as it's typically tied to login and non-editable
      if (userEmail) {
        setEmail(userEmail);
      }

      console.log('Fetching profile for userId:', userId);

      try {
        const response = await axios.post(
          API_GRAPHQL_ENDPOINT,
          {
            query: GET_PROFILE_QUERY,
            variables: { userId: userId },
            operationName: 'GetProfileDetails',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              // Add authorization header if required:
              // 'Authorization': `Bearer ${storage.getString('authToken')}`,
            },
          }
        );

        console.log('Fetched profile response:', JSON.stringify(response.data, null, 2));

        if (response.data.errors) {
          const errorMessage = response.data.errors[0]?.message || 'Failed to fetch profile data.';
          Alert.alert('Error', errorMessage);
          // If profile not found, the fields will remain empty/default, allowing creation.
          if (response.data.errors[0]?.extensions?.code === 'NOT_FOUND') {
            console.log('Profile not found for this user. Ready to create a new one.');
          }
        } else if (response.data.data && response.data.data.getProfileDetails) {
          const fetchedProfile: ProfileData = response.data.data.getProfileDetails;
          console.log('Profile fetched successfully:', fetchedProfile);

          // Populate states with fetched data
          setSalutation(fetchedProfile.salutation);
          setFirstName(fetchedProfile.firstName);
          setLastName(fetchedProfile.lastName);
          setMobileNo(fetchedProfile.mobileNo);
          setWhatsAppNumber(fetchedProfile.whatsAppNumber);
          setWhatsAppSameAsMobile(fetchedProfile.whatsAppNumber === fetchedProfile.mobileNo);
          setEmail(fetchedProfile.email); // Set email from fetched data (should match userEmail)
          setDateOfBirth(fetchedProfile.dateOfBirth);
          setSelectedGender(fetchedProfile.gender);
          setResidenceCity(fetchedProfile.residenceCity);

          const isStandardEducation = educationOptions.some(opt => opt.value === fetchedProfile.education);
          if (isStandardEducation) {
            setEducation(fetchedProfile.education);
            setCustomEducation('');
          } else {
            setEducation('Other');
            setCustomEducation(fetchedProfile.education || '');
          }

          setCollegeName(fetchedProfile.collegeName);
          setCollegeCityVillage(fetchedProfile.collegeCityVillage);
          if (fetchedProfile.profileImageUrl) {
            setProfileImage({ uri: fetchedProfile.profileImageUrl });
          }

          // Store original data to revert on cancel
          setOriginalData(fetchedProfile);
        } else {
          // This case should ideally be covered by response.data.errors for 'NOT_FOUND'
          // but as a fallback:
          Alert.alert('Info', 'No existing profile found. Please create your profile.');
        }
      } catch (error: any) {
        console.error('Network or Axios error fetching profile:', error);
        Alert.alert('Error', 'Could not connect to the server or fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Runs once on component mount

  // Auto-populate WhatsApp number logic
  useEffect(() => {
    if (isEditMode && whatsAppSameAsMobile) {
      setWhatsAppNumber(mobileNo);
    } else if (!isEditMode && originalData && originalData.whatsAppNumber !== originalData.mobileNo) {
      // If exiting edit mode and WhatsApp was NOT originally same as mobile, revert to original WhatsApp
      setWhatsAppNumber(originalData.whatsAppNumber);
    } else if (!isEditMode && whatsAppSameAsMobile && originalData && originalData.whatsAppNumber === originalData.mobileNo) {
        // If exiting edit mode and WhatsApp WAS originally same as mobile, keep it as mobileNo
        setWhatsAppNumber(mobileNo); // Keep it populated with the mobile number from view mode
    } else if (!isEditMode && !whatsAppSameAsMobile && originalData && originalData.whatsAppNumber === originalData.mobileNo) {
        // If exiting edit mode, checkbox is unchecked, but original data had them same, clear it
        setWhatsAppNumber('');
    } else if (!isEditMode && !whatsAppSameAsMobile && whatsAppNumber === mobileNo) {
        // This handles case where user manually types mobile number into whatsapp and then unchecks 'same as mobile'
        // and then exits edit mode. We should clear it.
        setWhatsAppNumber('');
    }
  }, [whatsAppSameAsMobile, mobileNo, isEditMode, originalData]); // Added originalData to dependency array for more precise reverting

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

  const handleSave = async (): Promise<void> => {
    // Input Validation
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(firstName)) {
      Alert.alert('Invalid First Name', 'First Name must contain only letters and spaces, and be at least 2 characters long.');
      return;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert('Invalid Last Name', 'Last Name must contain only letters and spaces, and be at least 2 characters long.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobileNo)) {
      Alert.alert('Invalid Mobile Number', 'Mobile Number must be exactly 10 digits.');
      return;
    }
    // Only validate whatsAppNumber if it's not the same as mobileNo or if the checkbox is unchecked
    if (!whatsAppSameAsMobile && whatsAppNumber && !phoneRegex.test(whatsAppNumber)) {
      Alert.alert('Invalid WhatsApp Number', 'WhatsApp Number must be exactly 10 digits.');
      return;
    }
    if (!whatsAppNumber && !whatsAppSameAsMobile) {
        Alert.alert('Missing Information', 'WhatsApp Number is required or select "Same as Mobile No".');
        return;
    }


    if (
      !salutation ||
      !firstName ||
      !lastName ||
      !mobileNo ||
      !email ||
      !dateOfBirth ||
      !selectedGender ||
      !residenceCity ||
      !education ||
      (education === 'Other' && !customEducation) ||
      !collegeName ||
      !collegeCityVillage
    ) {
      Alert.alert('Missing Information', 'Please fill in all the required fields.');
      return;
    }

    // Age validation
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      if (dob > eighteenYearsAgo) {
        Alert.alert('Age Restriction', 'You must be at least 18 years old.');
        return;
      }
    }

    const finalEducationValue = education === 'Other' ? customEducation : education;
    const currentUserId = storage.getString('userId');
    if (!currentUserId) {
        Alert.alert('Authentication Error', 'User ID not found. Please log in again.');
        return;
    }

    // Placeholder for S3 image upload logic
    let finalProfileImageUrl: string | undefined = profileImage.uri;
    if (profileImage && profileImage.uri && profileImage.uri.startsWith('file://')) {
      // In a real app, you would upload the image here and get its S3 URL
      // For demonstration, we'll just log and use a mock URL
      console.log("Image upload to S3 triggered for:", profileImage.uri);
      // Example of a mock S3 URL:
      finalProfileImageUrl = `https://your-s3-bucket.com/profile-images/${currentUserId}-${Date.now()}.jpg`;
      // You would implement the actual S3 upload here
      // const s3UploadResult = await uploadImageToS3(profileImage.uri, currentUserId);
      // if (s3UploadResult.success) {
      //    finalProfileImageUrl = s3UploadResult.url;
      // } else {
      //    Alert.alert("Upload Failed", "Could not upload profile image.");
      //    return;
      // }
    }


    const variables = {
      input: {
        userId: currentUserId,
        salutation: salutation,
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNo,
        whatsAppNumber: whatsAppSameAsMobile ? mobileNo : whatsAppNumber, // Ensure correct WhatsApp number is sent
        email: email, // Maps to emailid on your backend
        dateOfBirth: dateOfBirth,
        gender: selectedGender,
        residenceCity: residenceCity,
        education: finalEducationValue,
        collegeName: collegeName,
        collegeCityVillage: collegeCityVillage,
        profileImageUrl: finalProfileImageUrl, // Include if your schema has this field
      },
    };

    console.log('Sending data to backend:', variables);

    try {
      const response = await axios.post(
        API_GRAPHQL_ENDPOINT,
        {
          query: CREATE_PROFILE_MUTATION,
          variables: variables,
          operationName: 'CreateOrUpdateProfileDetails',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${storage.getString('authToken')}`,
          },
        }
      );

      console.log('Backend response:', JSON.stringify(response.data, null, 2));

      if (response.data.errors) {
        const errorMessage = response.data.errors[0]?.message || 'Something went wrong on the server.';
        Alert.alert('Operation Failed', errorMessage);
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditMode(false); // Exit edit mode on success
        // IMPORTANT: Update originalData with the newly saved data
        if (response.data.data?.createOrUpdateProfileDetails) {
            setOriginalData(response.data.data.createOrUpdateProfileDetails);
            // Also update current states just in case for immediate display
            const updatedProfile = response.data.data.createOrUpdateProfileDetails;
            setSalutation(updatedProfile.salutation);
            setFirstName(updatedProfile.firstName);
            setLastName(updatedProfile.lastName);
            setMobileNo(updatedProfile.mobileNo);
            setWhatsAppNumber(updatedProfile.whatsAppNumber);
            setWhatsAppSameAsMobile(updatedProfile.whatsAppNumber === updatedProfile.mobileNo);
            setEmail(updatedProfile.email);
            setDateOfBirth(updatedProfile.dateOfBirth);
            setSelectedGender(updatedProfile.gender);
            setResidenceCity(updatedProfile.residenceCity);
            const isStandardEducation = educationOptions.some(opt => opt.value === updatedProfile.education);
            if (isStandardEducation) {
                setEducation(updatedProfile.education);
                setCustomEducation('');
            } else {
                setEducation('Other');
                setCustomEducation(updatedProfile.education || '');
            }
            setCollegeName(updatedProfile.collegeName);
            setCollegeCityVillage(updatedProfile.collegeCityVillage);
            if (updatedProfile.profileImageUrl) {
                setProfileImage({ uri: updatedProfile.profileImageUrl });
            }
        }
      }
    } catch (error: any) {
      console.error('Error during profile creation/update:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Error',
          error.response?.data?.errors?.[0]?.message || 'Server error occurred.'
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
      }
    }
  };

  const handleCancel = (): void => {
    if (!isEditMode) {
      goBack(); // If not in edit mode, just go back
      return;
    }

    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to discard your changes?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            // Revert all state to original data if available
            if (originalData) {
              setSalutation(originalData.salutation);
              setFirstName(originalData.firstName);
              setLastName(originalData.lastName);
              setMobileNo(originalData.mobileNo);
              setWhatsAppNumber(originalData.whatsAppNumber);
              setWhatsAppSameAsMobile(originalData.whatsAppNumber === originalData.mobileNo);
              setEmail(originalData.email);
              setDateOfBirth(originalData.dateOfBirth);
              setSelectedGender(originalData.gender);
              setResidenceCity(originalData.residenceCity);

              const isStandardEducation = educationOptions.some(opt => opt.value === originalData.education);
              if (isStandardEducation) {
                setEducation(originalData.education);
                setCustomEducation('');
              } else {
                setEducation('Other');
                setCustomEducation(originalData.education || '');
              }

              setCollegeName(originalData.collegeName);
              setCollegeCityVillage(originalData.collegeCityVillage);
              if (originalData.profileImageUrl) {
                  setProfileImage({ uri: originalData.profileImageUrl });
              }
            } else {
                // If there was no original data (e.g., first time creating profile), clear fields
                setSalutation(null);
                setFirstName('');
                setLastName('');
                setMobileNo('');
                setWhatsAppNumber('');
                setWhatsAppSameAsMobile(false);
                // Email is usually auto-populated from storage, keep it unless user wants to clear
                // setEmail('');
                setDateOfBirth('');
                setSelectedGender(null);
                setResidenceCity('');
                setEducation(null);
                setCustomEducation('');
                setCollegeName('');
                setCollegeCityVillage('');
                setProfileImage({ uri: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE' });
            }
            setIsEditMode(false); // Exit edit mode
          },
        },
      ]
    );
  };

  const handleImageChange = (): void => {
    if (!isEditMode) return;

    Alert.alert(
      'Change Photo',
      'This is where an image picker would open to allow you to select a new photo. You would use a library like `react-native-image-picker` or `expo-image-picker` here, then upload the selected image to a cloud storage like AWS S3 and update the `profileImage` state with the returned URL.'
    );
    // Example using a hypothetical image picker:
    /*
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error && response.assets && response.assets.length > 0) {
        setProfileImage({ uri: response.assets[0].uri });
      }
    });
    */
  };

  const showDatePicker = (): void => {
    if (!isEditMode) return;
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
      Alert.alert('Age Restriction', 'You must be at least 18 years old.');
      hideDatePicker();
      return;
    }
    setDateOfBirth(date.toLocaleDateString('en-CA')); // Format to YYYY-MM-DD
    hideDatePicker();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // Helper component to render a field in view or edit mode
  const FieldRenderer: React.FC<{ label: string; value: string | null; editable: boolean; children: React.ReactNode; }> =
  ({ label, value, editable, children }) => {
    // Determine the value to display in view mode
    let displayValue = value;
    if (label === "Salutation" && salutationOptions.find(opt => opt.value === value)) {
        displayValue = salutationOptions.find(opt => opt.value === value)?.label || value;
    } else if (label === "Gender" && genderOptions.find(opt => opt.value === value)) {
        displayValue = genderOptions.find(opt => opt.value === value)?.label || value;
    } else if (label === "Education" && education === 'Other' && customEducation) {
        displayValue = customEducation; // Show custom education if 'Other' is selected
    } else if (label === "Education" && educationOptions.find(opt => opt.value === value)) {
        displayValue = educationOptions.find(opt => opt.value === value)?.label || value;
    }


    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        {editable ? (
          children
        ) : (
          <Text style={styles.valueText}>{displayValue || 'N/A'}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={() => (isEditMode ? handleSave() : setIsEditMode(true))}>
          <Text style={isEditMode ? styles.saveButtonText : styles.headerButtonText}>
            {isEditMode ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Adjust offset as needed for Android
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Profile Image and Camera Icon */}
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity
              onPress={handleImageChange}
              style={[styles.cameraIcon, !isEditMode && styles.disabledCameraIcon]} // Apply disabled style
              disabled={!isEditMode}
            >
              <Text style={styles.cameraText}>📸</Text>
            </TouchableOpacity>
          </View>

          {/* Form section with TextInputs and Dropdowns */}
          <View style={styles.form}>
            {/* Salutation */}
            <FieldRenderer label="Salutation" value={salutation} editable={isEditMode}>
              <DropdownComponent
                data={salutationOptions}
                placeholder="Select Salutation"
                value={salutation}
                onSelect={setSalutation}
                icon="account-circle-outline"
                searchable={false}
                disabled={!isEditMode} // Disable dropdown when not in edit mode
                inputContainerStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* First Name and Last Name side-by-side (Corrected structure) */}
            <View style={styles.nameInputContainer}>
              {/* First Name */}
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>First Name</Text>
                {isEditMode ? (
                  <CustomTextInput
                    iconLeft="account-outline"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={isEditMode}
                    inputStyle={!isEditMode && styles.disabledInput}
                  />
                ) : (
                  <Text style={styles.valueText}>{firstName || 'N/A'}</Text>
                )}
              </View>

              {/* Last Name */}
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Last Name</Text>
                {isEditMode ? (
                  <CustomTextInput
                    iconLeft="account-outline"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    editable={isEditMode}
                    inputStyle={!isEditMode && styles.disabledInput}
                  />
                ) : (
                  <Text style={styles.valueText}>{lastName || 'N/A'}</Text>
                )}
              </View>
            </View>

            {/* Mobile No */}
            <FieldRenderer label="Mobile Number" value={mobileNo} editable={isEditMode}>
              <CustomTextInput
                iconLeft="phone-outline"
                placeholder="Mobile No"
                value={mobileNo}
                onChangeText={setMobileNo}
                keyboardType="phone-pad"
                maxLength={10}
                editable={isEditMode} // Ensure this is explicitly set
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* WhatsApp Same As Mobile checkbox */}
            <CustomCheckbox
              label="WhatsApp number same as Mobile No"
              checked={whatsAppSameAsMobile}
              onPress={() => isEditMode && setWhatsAppSameAsMobile(!whatsAppSameAsMobile)}
              style={!isEditMode && styles.disabledCheckbox}
            />

            {/* WhatsApp Number input */}
            <FieldRenderer label="WhatsApp Number" value={whatsAppNumber} editable={isEditMode && !whatsAppSameAsMobile}>
              <CustomTextInput
                iconLeft="whatsapp"
                placeholder="WhatsApp Number"
                value={whatsAppNumber}
                onChangeText={setWhatsAppNumber}
                keyboardType="phone-pad"
                maxLength={10}
                editable={isEditMode && !whatsAppSameAsMobile} // Corrected: only editable if in edit mode AND not same as mobile
                inputStyle={!isEditMode || whatsAppSameAsMobile ? styles.disabledInput : {}} // Visually disable when auto-filled
              />
            </FieldRenderer>

            {/* Email (not editable) */}
            <FieldRenderer label="Email" value={email} editable={false}>
              <CustomTextInput
                iconLeft="email-outline"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false} // Email remains non-editable
                inputStyle={styles.disabledInput} // Always disabled style
              />
            </FieldRenderer>

            {/* Date of Birth Input - Uses TouchableOpacity to trigger date picker */}
            <FieldRenderer label="Date of Birth" value={dateOfBirth} editable={isEditMode}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.dateInputWrapper}
                disabled={!isEditMode} // Disable touch if not in edit mode
              >
                <CustomTextInput
                  iconLeft="calendar"
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  value={dateOfBirth}
                  editable={false} // Make CustomTextInput itself not editable
                  pointerEvents="none" // Ensure touches go through to TouchableOpacity
                  inputStyle={!isEditMode && styles.disabledInput}
                />
              </TouchableOpacity>
            </FieldRenderer>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              maximumDate={new Date()} // Prevents selecting future dates
            />

            {/* Gender Dropdown */}
            <FieldRenderer label="Gender" value={selectedGender} editable={isEditMode}>
              <DropdownComponent
                data={genderOptions}
                placeholder="Select Gender"
                value={selectedGender}
                onSelect={setSelectedGender}
                icon="gender-male-female"
                searchable={false}
                disabled={!isEditMode}
                inputContainerStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* Residence City */}
            <FieldRenderer label="Residence City" value={residenceCity} editable={isEditMode}>
              <CustomTextInput
                iconLeft="city-variant-outline"
                placeholder="Residence City"
                value={residenceCity}
                onChangeText={setResidenceCity}
                editable={isEditMode}
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* Education */}
            <FieldRenderer label="Education" value={education} editable={isEditMode}>
              <DropdownComponent
                data={educationOptions}
                placeholder="Education"
                value={education}
                onSelect={setEducation}
                icon="school-outline"
                searchable={true}
                disabled={!isEditMode}
                inputContainerStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>
            {education === 'Other' && (
              <FieldRenderer label="" value={customEducation} editable={isEditMode}>
                <CustomTextInput
                  iconLeft="school-outline"
                  placeholder="Specify your Education"
                  value={customEducation}
                  onChangeText={setCustomEducation}
                  containerStyle={styles.customEducationInput}
                  editable={isEditMode}
                  inputStyle={!isEditMode && styles.disabledInput}
                />
              </FieldRenderer>
            )}

            {/* College Name */}
            <FieldRenderer label="College Name" value={collegeName} editable={isEditMode}>
              <CustomTextInput
                iconLeft="office-building-outline"
                placeholder="College Name"
                value={collegeName}
                onChangeText={setCollegeName}
                editable={isEditMode}
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* College City/Village */}
            <FieldRenderer label="College City/Village" value={collegeCityVillage} editable={isEditMode}>
              <CustomTextInput
                iconLeft="map-marker-outline"
                placeholder="College City/Village"
                value={collegeCityVillage}
                onChangeText={setCollegeCityVillage}
                editable={isEditMode}
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Lighter background for a cleaner look
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: moderateScaleVertical(10),
    fontSize: fontR(16),
    color: '#555',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(90), // Increased to ensure content is below fixed header
    paddingBottom: moderateScaleVertical(30),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: Platform.OS === 'android' ? moderateScaleVertical(15) : verticalScale(20), // More consistent padding
    paddingBottom: moderateScaleVertical(15),
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth, // Thinner, more subtle border
    borderBottomColor: '#e0e0e0',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 2, // Subtle shadow for Android
    shadowColor: '#000', // Subtle shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  headerTitle: {
    fontSize: fontR(20),
    fontWeight: '600', // Slightly less bold for modern look
    color: '#333',
  },
  headerButtonText: {
    color: '#007bff',
    fontSize: fontR(16),
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#28a745',
    fontSize: fontR(16),
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    position: 'relative',
  },
  profileImage: {
    width: scale(120), // Slightly larger image
    height: scale(120),
    borderRadius: scale(60), // Half of width/height for perfect circle
    backgroundColor: '#e9e9e9', // Lighter background for placeholder
    borderWidth: 3, // Thicker border
    borderColor: '#ddd',
    // Add a subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: screenWidth / 2 - scale(60) + scale(40), // Adjusted for new image size and better placement
    backgroundColor: '#6A5ACD', // Primary color for camera icon
    borderRadius: moderateScale(25), // Larger, more circular icon
    width: moderateScale(50),
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, // Border for the icon
    borderColor: '#fff', // White border
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledCameraIcon: {
    opacity: 0.5, // Visually disable when not in edit mode
  },
  cameraText: {
    color: '#fff',
    fontSize: fontR(24), // Larger icon text
  },
  form: {
    width: '100%',
    backgroundColor: '#fff', // Form background
    borderRadius: 10,
    padding: moderateScale(15),
    elevation: 2, // Subtle shadow for form container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    marginBottom: verticalScale(20), // Spacing from bottom
  },
  fieldContainer: {
    marginBottom: moderateScaleVertical(15), // Increased spacing between fields
  },
  label: {
    fontSize: fontR(14),
    color: '#555',
    marginBottom: verticalScale(5),
    fontWeight: '500', // Slightly bolder label
  },
  valueText: {
    fontSize: fontR(16),
    color: '#333',
    paddingVertical: verticalScale(10), // More padding
    paddingHorizontal: moderateScale(10), // Added horizontal padding
    backgroundColor: '#f9f9f9', // Light background for value text
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Subtle border
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScaleVertical(15), // Consistent spacing
  },
  halfInputContainer: { // New style for the container holding label and input/text for half-width fields
    width: '48%', // This ensures each takes roughly half the space
    // No specific marginBottom here, as fieldContainer now handles it
  },
  halfInput: { // This style is for the CustomTextInput itself, not its container
    // This style can be left empty if CustomTextInput handles its own spacing/sizing
    // or include properties like flex: 1 if it needs to fill available space within a parent View.
  },
  dateInputWrapper: {
    // No direct styling needed here, CustomTextInput handles appearance
  },
  customEducationInput: {
    marginTop: moderateScaleVertical(5), // Adjusted to align better
  },
  disabledInput: {
    backgroundColor: '#e0e0e0', // Grey out disabled inputs
    color: '#777', // Dim text color
    opacity: 0.8, // Slightly transparent
  },
  disabledCheckbox: {
    opacity: 0.6,
  },
});

export default EditProfileScreen;