import React, { useState, useEffect, useRef } from 'react';
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
    PermissionsAndroid, // For Android permissions
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker'; // Import ImagePicker
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique file names

import {
    fontR,
    scale,
    verticalScale,
    moderateScale,
    moderateScaleVertical,
    screenWidth,
} from '../utils/Scaling';

import CustomCheckbox from '../components/CustomCheckbox';
import { storage } from '../utils/storage';
import { API_GRAPHQL_ENDPOINT, PRESIGNED_URL_BACKEND_ENDPOINT } from '../utils/Constants'; // Import PRESIGNED_URL_BACKEND_ENDPOINT
import { CREATE_PROFILE_MUTATION, GET_PROFILE_DETAILS_QUERY, } from '../utils/mutation';
import { goBack } from '../utils/NavigationUtils';
import CustomTextInput from '../components/CustomTextInput';
import DropdownComponent from '../components/DropdownComponent';

const { width, height } = Dimensions.get('window');

interface Option {
    label: string;
    value: string;
}

interface ProfileData {
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
    profileImage?: string; // Changed to profileImage to match schema
    createdAt: string;
    updatedAt: string;
}

const ProfileEditScreen: React.FC = () => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // For initial profile fetch

    // Profile data states
    const [salutation, setSalutation] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [mobileNo, setMobileNo] = useState<string>('');
    const [whatsAppSameAsMobile, setWhatsAppSameAsMobile] = useState<boolean>(false);
    const [whatsAppNumber, setWhatsAppNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [residenceCity, setResidenceCity] = useState<string>('');
    const [education, setEducation] = useState<string | null>(null);
    const [customEducation, setCustomEducation] = useState<string>('');
    const [collegeName, setCollegeName] = useState<string>('');
    const [collegeCityVillage, setCollegeCityVillage] = useState<string>('');

    // --- Image Upload States (NEW/MODIFIED) ---
    const [profileImageDisplayUri, setProfileImageDisplayUri] = useState<string | null>(null); // URI for Image component
    const [localImageSource, setLocalImageSource] = useState<{ uri: string; fileName: string; fileType: string } | null>(null); // For selected local image
    const [s3UploadLoading, setS3UploadLoading] = useState<boolean>(false);
    const [s3UploadProgress, setS3UploadProgress] = useState<number>(0);
    const [s3UploadError, setS3UploadError] = useState<string | null>(null);
    const uploadTimerRef = useRef<NodeJS.Timeout | null>(null); // For S3 upload simulation/progress

    const [originalData, setOriginalData] = useState<ProfileData | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

    // --- User ID from storage ---
    const currentUserId = storage.getString('userId');
    const userEmail = storage.getString('userEmail');

    // --- Permissions Request ---
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const permissionsToRequest = [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ];
                if (Platform.Version >= 33) {
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
                } else {
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                }

                const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);

                const allGranted = permissionsToRequest.every(permission =>
                    granted[permission] === PermissionsAndroid.RESULTS.GRANTED
                );

                if (allGranted) {
                    console.log("Storage and Camera permissions granted");
                    return true;
                } else {
                    console.log("Permissions denied");
                    Alert.alert("Permissions Denied", "Storage and Camera permissions are needed to select/capture images.");
                    return false;
                }
            } catch (err) {
                console.warn(err);
                Alert.alert("Permission Error", "An error occurred while requesting permissions.");
                return false;
            }
        }
        return true; // iOS handles permissions differently or prompts automatically
    };


    // --- S3 Upload Logic (Copied from previous example) ---
    const uploadImageToS3 = async (
        localImageUri: string,
        fileName: string,
        fileType: string,
        userId: string
    ) => {
        setS3UploadLoading(true);
        setS3UploadProgress(0);
        setS3UploadError(null);

        try {
            console.log('Requesting presigned URL...');
            const presignedUrlResponse = await fetch(PRESIGNED_URL_BACKEND_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add your authentication token here if your backend requires it
                    // 'Authorization': `Bearer YOUR_AUTH_TOKEN`,
                },
                body: JSON.stringify({
                    fileName,
                    fileType,
                    userId,
                }),
            });

            if (!presignedUrlResponse.ok) {
                const errorText = await presignedUrlResponse.text();
                throw new Error(`Failed to get presigned URL: ${presignedUrlResponse.status} - ${errorText}`);
            }

            const presignedUrlData = await presignedUrlResponse.json();
            const uploadUrl = presignedUrlData.uploadUrl;
            const receivedPublicImageUrl = presignedUrlData.publicImageUrl;

            console.log('Received Presigned URL:', uploadUrl);
            console.log('Public S3 Image URL:', receivedPublicImageUrl);

            console.log('Converting image URI to Blob...');
            const imageResponse = await fetch(localImageUri);
            const imageBlob = await imageResponse.blob();
            console.log(`Image Blob Type: ${imageBlob.type}, Size: ${imageBlob.size}`);

            console.log('Uploading image to S3...');

            // For tracking progress with fetch, you'd typically need a different library
            // or a more complex setup. For simplicity, we'll simulate progress
            // if you truly need real progress for large files, consider react-native-blob-util
            // or an XMLHttpRequest based approach.
            // For now, setting progress to 100% on success.
            // You can remove the uploadTimerRef entirely if not simulating progress.

            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: imageBlob,
                headers: {
                    'Content-Type': fileType,
                },
            });

            if (!uploadResponse.ok) {
                const errorBody = await uploadResponse.text();
                console.error('Raw S3 Upload Error Response:', errorBody);
                throw new Error(`S3 upload failed: ${uploadResponse.status} - ${errorBody}`);
            }

            console.log('Image uploaded to S3 successfully!');
            Alert.alert('Success', 'Profile image uploaded to S3!');
            setProfileImageDisplayUri(receivedPublicImageUrl); // Update the displayed image
            setS3UploadProgress(1); // Set to 100% on success

            // Return the public URL so handleSave can use it
            return { success: true, url: receivedPublicImageUrl };

        } catch (error: any) {
            console.error('Error in S3 upload process:', error);
            const errorMessage = error.message || 'An unknown error occurred during S3 upload.';
            setS3UploadError(errorMessage);
            Alert.alert('S3 Upload Failed', errorMessage);
            return { success: false, url: undefined }; // Indicate failure
        } finally {
            setS3UploadLoading(false);
            if (uploadTimerRef.current) {
                clearTimeout(uploadTimerRef.current);
                uploadTimerRef.current = null;
            }
        }
    };


    // --- useEffect for fetching initial profile data ---
    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);

            if (!currentUserId) {
                Alert.alert('Error', 'User ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            if (userEmail) {
                setEmail(userEmail);
            }

            console.log('Fetching profile for userId:', currentUserId);

            try {
                const response = await axios.post(
                    API_GRAPHQL_ENDPOINT,
                    {
                        query: GET_PROFILE_DETAILS_QUERY,
                        variables: { userId: currentUserId },
                        operationName: 'GetProfileDetails',
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': `Bearer ${storage.getString('authToken')}`,
                        },
                    }
                );

                console.log('Fetched profile response:', JSON.stringify(response.data, null, 2));

                if (response.data.errors) {
                    const errorMessage = response.data.errors[0]?.message || 'Failed to fetch profile data.';
                    Alert.alert('Error', errorMessage);
                    if (response.data.errors[0]?.extensions?.code === 'NOT_FOUND') {
                        console.log('Profile not found for this user. Ready to create a new one.');
                        // If profile is not found, keep fields empty/default
                        setProfileImageDisplayUri(null); // No image to display
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
                    setEmail(fetchedProfile.email);
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
                    if (fetchedProfile.profileImage) { // Check for profileImage
                        setProfileImageDisplayUri(fetchedProfile.profileImage); // Set the display URI
                    } else {
                        setProfileImageDisplayUri('https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE');
                    }

                    setOriginalData(fetchedProfile); // Store original data
                } else {
                    Alert.alert('Info', 'No existing profile found. Please create your profile.');
                    setProfileImageDisplayUri('https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE');
                }
            } catch (error: any) {
                console.error('Network or Axios error fetching profile:', error);
                Alert.alert('Error', 'Could not connect to the server or fetch profile data.');
                setProfileImageDisplayUri('https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUserId, userEmail]); // Re-run if userId or userEmail changes (though typically static)

    // Auto-populate WhatsApp number logic
    useEffect(() => {
        if (isEditMode && whatsAppSameAsMobile) {
            setWhatsAppNumber(mobileNo);
        } else if (!isEditMode && originalData && originalData.whatsAppNumber !== originalData.mobileNo) {
            setWhatsAppNumber(originalData.whatsAppNumber);
        } else if (!isEditMode && whatsAppSameAsMobile && originalData && originalData.whatsAppNumber === originalData.mobileNo) {
            setWhatsAppNumber(mobileNo);
        } else if (!isEditMode && !whatsAppSameAsMobile && originalData && originalData.whatsAppNumber === originalData.mobileNo) {
            setWhatsAppNumber('');
        } else if (!isEditMode && !whatsAppSameAsMobile && whatsAppNumber === mobileNo) {
            setWhatsAppNumber('');
        }
    }, [whatsAppSameAsMobile, mobileNo, isEditMode, originalData]);

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
        if (!currentUserId) {
            Alert.alert('Authentication Error', 'User ID not found. Please log in again.');
            return;
        }

        // --- Handle Image Upload before saving profile ---
        let finalProfileImageUrl: string | undefined = profileImageDisplayUri || undefined; // Start with current displayed image URL

        if (localImageSource) { // If a new local image was selected
            console.log("New local image found. Initiating S3 upload for saving profile.");
            const s3UploadResult = await uploadImageToS3(
                localImageSource.uri,
                localImageSource.fileName,
                localImageSource.fileType,
                currentUserId
            );

            if (s3UploadResult.success) {
                finalProfileImageUrl = s3UploadResult.url;
            } else {
                Alert.alert("Image Upload Failed", "Could not upload the new profile image to S3. Please try again.");
                return; // Stop the save process if image upload fails
            }
        }

        const variables = {
            input: {
                userId: currentUserId,
                salutation: salutation,
                firstName: firstName,
                lastName: lastName,
                mobileNo: mobileNo,
                whatsAppNumber: whatsAppSameAsMobile ? mobileNo : whatsAppNumber,
                email: email,
                dateOfBirth: dateOfBirth,
                gender: selectedGender,
                residenceCity: residenceCity,
                education: finalEducationValue,
                collegeName: collegeName,
                collegeCityVillage: collegeCityVillage,
                profileImage: finalProfileImageUrl, // Use the S3 URL (could be new or existing)
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
                setIsEditMode(false);
                // IMPORTANT: Update originalData with the newly saved data
                if (response.data.data?.createOrUpdateProfileDetails) {
                    const updatedProfile = response.data.data.createOrUpdateProfileDetails;
                    setOriginalData(updatedProfile);
                    // Also update current states for immediate display (though should largely be the same)
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
                    if (updatedProfile.profileImage) {
                        setProfileImageDisplayUri(updatedProfile.profileImage);
                    }
                    setLocalImageSource(null); // Clear local image source after successful save
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
            goBack();
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
                            if (originalData.profileImage) {
                                setProfileImageDisplayUri(originalData.profileImage);
                            } else {
                                setProfileImageDisplayUri('https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE');
                            }
                        } else {
                            // If no original data (first time profile creation), clear fields
                            setSalutation(null);
                            setFirstName('');
                            setLastName('');
                            setMobileNo('');
                            setWhatsAppNumber('');
                            setWhatsAppSameAsMobile(false);
                            // setEmail is usually from storage, consider if you want to clear it
                            setDateOfBirth('');
                            setSelectedGender(null);
                            setResidenceCity('');
                            setEducation(null);
                            setCustomEducation('');
                            setCollegeName('');
                            setCollegeCityVillage('');
                            setProfileImageDisplayUri('https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE');
                        }
                        setLocalImageSource(null); // Clear any pending local image
                        setS3UploadError(null); // Clear any S3 upload errors
                        setS3UploadLoading(false);
                        setS3UploadProgress(0);
                        setIsEditMode(false);
                    },
                },
            ]
        );
    };

    const handleImageChange = async (): Promise<void> => {
        if (!isEditMode) return;

        setS3UploadError(null); // Clear any previous S3 errors
        setS3UploadLoading(false); // Reset loading state
        setS3UploadProgress(0); // Reset progress

        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            return;
        }

        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                compressImageQuality: 0.8,
                mediaType: 'photo',
                forceJpg: true,
            });

            if (uploadTimerRef.current) {
                clearTimeout(uploadTimerRef.current);
                uploadTimerRef.current = null;
                console.log('Previous S3 upload timer cleared due to new image selection.');
            }

            const newImageSource = {
                uri: image.path,
                fileName: image.filename || `${uuidv4()}.jpg`,
                fileType: image.mime,
            };
            setLocalImageSource(newImageSource); // Set the local image source
            setProfileImageDisplayUri(newImageSource.uri); // Immediately show the selected image locally

            // Note: We no longer automatically upload to S3 here.
            // Upload to S3 will happen during handleSave() to ensure data consistency.
            Alert.alert('Image Selected', 'Image selected successfully. Click "Save" to upload and update your profile.');

        } catch (error: any) {
            if (error.code === 'E_PICKER_CANCELLED') {
                console.log('User cancelled image selection.');
            } else {
                console.error('Error selecting or cropping image:', error);
                Alert.alert('Error', `Failed to select or crop image: ${error.message || 'Unknown error'}`);
            }
        }
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
                displayValue = customEducation;
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {/* Profile Image and Camera Icon */}
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: profileImageDisplayUri || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PROFILE' }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity
                            onPress={handleImageChange}
                            style={[styles.cameraIcon, !isEditMode && styles.disabledCameraIcon]}
                            disabled={!isEditMode || s3UploadLoading} // Disable if not in edit mode or S3 upload is in progress
                        >
                            <Text style={styles.cameraText}>📸</Text>
                        </TouchableOpacity>
                    </View>

                    {/* S3 Upload Status Indicators */}
                    {s3UploadLoading && (
                        <View style={styles.s3StatusContainer}>
                            <ActivityIndicator size="small" color="#0000ff" />
                            <Text style={styles.s3StatusText}>Uploading image... {(s3UploadProgress * 100).toFixed(0)}%</Text>
                        </View>
                    )}
                    {s3UploadError && (
                        <View style={styles.s3ErrorContainer}>
                            <Text style={styles.s3ErrorText}>Image Upload Error: {s3UploadError}</Text>
                        </View>
                    )}

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
                                disabled={!isEditMode}
                                inputContainerStyle={!isEditMode && styles.disabledInput}
                            />
                        </FieldRenderer>

                        {/* First Name and Last Name side-by-side */}
                        <View style={styles.nameInputContainer}>
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
                                editable={isEditMode}
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
                                editable={isEditMode && !whatsAppSameAsMobile}
                                inputStyle={!isEditMode || whatsAppSameAsMobile ? styles.disabledInput : {}}
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
                                editable={false}
                                inputStyle={styles.disabledInput}
                            />
                        </FieldRenderer>

                        {/* Date of Birth Input - Uses TouchableOpacity to trigger date picker */}
                        <FieldRenderer label="Date of Birth" value={dateOfBirth} editable={isEditMode}>
                            <TouchableOpacity
                                onPress={showDatePicker}
                                style={styles.dateInputWrapper}
                                disabled={!isEditMode}
                            >
                                <CustomTextInput
                                    iconLeft="calendar"
                                    placeholder="Date of Birth (YYYY-MM-DD)"
                                    value={dateOfBirth}
                                    editable={false}
                                    pointerEvents="none"
                                    inputStyle={!isEditMode && styles.disabledInput}
                                />
                            </TouchableOpacity>
                        </FieldRenderer>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmDate}
                            onCancel={hideDatePicker}
                            maximumDate={new Date()}
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
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: moderateScale(10),
        fontSize: fontR(16), // fontR returns a number for fontSize, which is correct
        color: '#555',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScaleVertical(10),
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
        width: '100%',
    },
    headerButtonText: {
        color: '#007AFF',
        fontSize: fontR(16), // Correct
        fontWeight: 'normal',
    },
    saveButtonText: {
        color: '#007AFF',
        fontSize: fontR(16), // Correct
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: fontR(18), // Correct
        fontWeight: 'bold',
        color: '#333',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScaleVertical(30),
        alignItems: 'center',
    },
    profileImageContainer: {
        width: moderateScale(150),
        height: moderateScale(150),
        borderRadius: moderateScale(75),
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScaleVertical(20),
        marginBottom: moderateScaleVertical(20),
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#ccc',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: moderateScale(5),
        right: moderateScale(5),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: moderateScale(20),
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledCameraIcon: {
        opacity: 0.5,
    },
    cameraText: {
        fontSize: fontR(20), // Correct
    },
    s3StatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScaleVertical(10),
        marginBottom: moderateScaleVertical(5),
        padding: moderateScale(10),
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
        width: '100%',
        justifyContent: 'center',
    },
    s3StatusText: {
        marginLeft: moderateScale(10),
        fontSize: fontR(14), // Correct
        color: '#00796b',
    },
    s3ErrorContainer: {
        marginTop: moderateScaleVertical(10),
        marginBottom: moderateScaleVertical(5),
        padding: moderateScale(10),
        backgroundColor: '#ffebee',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ef9a9a',
        width: '100%',
        alignItems: 'center',
    },
    s3ErrorText: {
        color: '#d32f2f',
        fontSize: fontR(14), // Correct
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    fieldContainer: {
        marginBottom: moderateScaleVertical(15),
    },
    label: {
        fontSize: fontR(14), // Correct
        color: '#555',
        marginBottom: moderateScaleVertical(5),
        fontFamily: 'Inter-Medium', // Corrected: This must be a string literal for the font family name
    },
    valueText: {
        fontSize: fontR(16), // Correct
        color: '#333',
        paddingVertical: moderateScaleVertical(10),
        paddingHorizontal: moderateScale(12),
        backgroundColor: '#e9e9e9',
        borderRadius: 8,
        minHeight: verticalScale(48),
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: 'Inter-Regular', // Corrected: This must be a string literal
    },
    nameInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: moderateScaleVertical(15),
    },
    halfInputContainer: {
        width: '48%',
    },
    dateInputWrapper: {
        flex: 1,
    },
    customEducationInput: {
        marginTop: moderateScaleVertical(10),
    },
    disabledInput: {
        backgroundColor: '#e9e9e9',
        color: '#888',
    },
    disabledCheckbox: {
        opacity: 0.6,
    },
});

export default ProfileEditScreen;