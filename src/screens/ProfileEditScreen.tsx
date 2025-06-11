import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Button,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert,
    PermissionsAndroid,
    Platform,
    Pressable // For the retry button
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { v4 as uuidv4 } from 'uuid';
import { PRESIGNED_URL_BACKEND_ENDPOINT } from '../utils/Constants';

const EditProfileScreen: React.FC = () => {
    const [imageSource, setImageSource] = useState<{ uri: string; fileName: string; fileType: string } | null>(null);
    const [publicS3ImageUrl, setPublicS3ImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Ref to hold the timer ID, for now we will remove the timer, but keeping ref for safety
    const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Replace with your actual user ID (e.g., from auth context)
    const CURRENT_USER_ID = 'user123_dynamic'; // TODO: Replace with actual user ID from your authentication system

    // --- Permissions Request ---
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                // For Android 13 (API 33) and above, use READ_MEDIA_IMAGES
                const permissionsToRequest = [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ];
                if (Platform.Version >= 33) {
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
                } else {
                    // For older Android versions
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

    // --- Image Selection and Cropping ---
    const selectImage = async () => {
        setUploadError(null); // Clear any previous errors
        setIsLoading(false); // Reset loading state
        setUploadProgress(0); // Reset progress
        setPublicS3ImageUrl(null); // Clear previously uploaded image

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
                forceJpg: true, // Ensures output is JPG for consistency with S3
            });

            // Clear any existing upload timers if a new image is selected
            if (uploadTimerRef.current) {
                clearTimeout(uploadTimerRef.current);
                uploadTimerRef.current = null;
                console.log('Previous upload timer cleared due to new image selection.');
            }

            // Store selected image details in state
            const newImageSource = {
                uri: image.path,
                fileName: image.filename || `${uuidv4()}.jpg`,
                fileType: image.mime,
            };
            setImageSource(newImageSource);

            // Immediately initiate upload after setting the image source
            console.log('Image selected and cropped. Initiating immediate upload...');
            uploadImageToS3(newImageSource.uri, newImageSource.fileName, newImageSource.fileType, CURRENT_USER_ID);


        } catch (error: any) {
            if (error.code === 'E_PICKER_CANCELLED') {
                console.log('User cancelled image selection.');
            } else {
                console.error('Error selecting or cropping image:', error);
                Alert.alert('Error', `Failed to select or crop image: ${error.message || 'Unknown error'}`);
            }
        }
    };

    // --- S3 Upload Logic ---
    const uploadImageToS3 = async (
        localImageUri: string,
        fileName: string,
        fileType: string,
        userId: string
    ) => {
        setIsLoading(true);
        setUploadProgress(0);
        setUploadError(null); // Clear previous errors

        try {
            // Step 1: Request a presigned URL from your backend
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

            // Step 2: Convert local image URI to Blob
            console.log('Converting image URI to Blob...');
            const imageResponse = await fetch(localImageUri);
            const imageBlob = await imageResponse.blob();
            console.log(`Image Blob Type: ${imageBlob.type}, Size: ${imageBlob.size}`);

            // Step 3: Upload the image directly to S3 using the presigned URL
            console.log('Uploading image to S3...');

            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: imageBlob,
                headers: {
                    'Content-Type': fileType, // CRITICAL: Must match fileType used for presigned URL
                    // 'x-amz-acl': 'public-read', // REMOVED as per previous debugging
                },
            });

            if (!uploadResponse.ok) {
                const errorBody = await uploadResponse.text(); // Get the S3 error response body
                console.error('Raw S3 Upload Error Response:', errorBody);
                throw new Error(`S3 upload failed: ${uploadResponse.status} - ${errorBody}`);
            }

            console.log('Image uploaded to S3 successfully!');
            Alert.alert('Success', 'Profile image updated!');
            setPublicS3ImageUrl(receivedPublicImageUrl); // Store for display
            setUploadProgress(1); // Set to 100% on success

            // Optional: Update your user's profile in your database with the publicS3ImageUrl
            // This would be another API call to your backend
            // Example:
            // await fetch('YOUR_API_ENDPOINT/update-profile', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer YOUR_AUTH_TOKEN` },
            //     body: JSON.stringify({ userId, profileImageUrl: receivedPublicImageUrl }),
            // });

        } catch (error: any) {
            console.error('Error in upload process:', error);
            const errorMessage = error.message || 'An unknown error occurred during upload.';
            setUploadError(errorMessage); // Set error state
            Alert.alert('Upload Failed', errorMessage);
        } finally {
            setIsLoading(false);
            // setUploadProgress(0); // Only reset if you want to clear progress after failure
            uploadTimerRef.current = null; // Clear timer reference as upload has completed (or failed)
        }
    };

    // --- Render UI ---
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.imageContainer}>
                {imageSource ? (
                    <Image source={{ uri: imageSource.uri }} style={styles.profileImage} />
                ) : (
                    <Text>No image selected</Text>
                )}
            </View>

            <Button title="Select & Crop Image" onPress={selectImage} disabled={isLoading} />

            {/* Display status messages */}
            {imageSource && !isLoading && !uploadError && !publicS3ImageUrl && (
                <Text style={styles.statusText}>Image selected. Awaiting upload.</Text>
            )}

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Uploading...</Text>
                    {/* Progress tracking might be more complex with standard fetch */}
                    {uploadProgress > 0 && uploadProgress < 1 && (
                           <Text>Progress: {(uploadProgress * 100).toFixed(2)}%</Text>
                    )}
                </View>
            )}

            {uploadError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Upload Error: {uploadError}</Text>
                    <Pressable onPress={() => {
                        if (imageSource) {
                            // Retry the upload with the current imageSource
                            uploadImageToS3(imageSource.uri, imageSource.fileName, imageSource.fileType, CURRENT_USER_ID);
                        } else {
                            Alert.alert('No Image', 'Please select an image before retrying upload.');
                        }
                    }}>
                        <Text style={styles.retryButton}>Retry Upload</Text>
                    </Pressable>
                </View>
            )}

            {publicS3ImageUrl && (
                <View style={styles.uploadedImageContainer}>
                    <Text style={styles.uploadedImageText}>Uploaded Image on S3:</Text>
                    <Image source={{ uri: publicS3ImageUrl }} style={styles.uploadedProfileImage} />
                    <Text style={{ marginTop: 10, fontSize: 10, color: 'gray' }}>{publicS3ImageUrl}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    statusText: {
        marginTop: 10,
        fontSize: 14,
        color: 'blue',
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    errorContainer: {
        marginTop: 20,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ef9a9a',
    },
    errorText: {
        color: '#d32f2f',
        marginBottom: 10,
        textAlign: 'center',
    },
    retryButton: {
        color: '#1565c0',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    uploadedImageContainer: {
        marginTop: 30,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 20,
    },
    uploadedImageText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    uploadedProfileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#007bff',
    },
});

export default EditProfileScreen;