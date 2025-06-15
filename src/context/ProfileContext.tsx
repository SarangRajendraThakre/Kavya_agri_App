import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage'; // Adjust path as needed
import defaultProfileImage from '../assets/images/profileimage.jpg'; // Import default image here
import { Image } from 'react-native';

interface ProfileContextType {
  profileImage: string; // This will now always be a URI suitable for <Image>
  setProfileImage: (imageUri: string | null) => void; // Allow setting null to clear
  // ... other profile related states and functions
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with null, meaning no S3 URL is currently loaded from storage
  // The actual URI for display will be handled by getDisplayProfileImage
  const [profileImageS3Url, setProfileImageS3UrlState] = useState<string | null>(null);

  useEffect(() => {
    // Load profile image (S3 URL) from storage when context mounts
    const storedImage = storage.getString('profileImage');
    if (storedImage) {
      setProfileImageS3UrlState(storedImage); // If an S3 URL is stored, use it
    } else {
      // If no S3 URL is stored, leave as null. The display logic will handle the default.
      setProfileImageS3UrlState(null);
    }
  }, []);

  // Function to update profile image and store it in MMKV
  // It should receive the S3 URL from ProfileEditScreen
  const setProfileImage = (imageUri: string | null) => {
    setProfileImageS3UrlState(imageUri);
    if (imageUri) {
      storage.set('profileImage', imageUri); // Store the S3 URL
    } else {
      storage.delete('profileImage'); // If image is cleared, remove from storage
    }
  };

  // Helper function to return the correct URI for the <Image> component
  const getDisplayProfileImage = (): string => {
    // If we have an S3 URL, use it
    if (profileImageS3Url) {
      return profileImageS3Url;
    }
    // Otherwise, return the URI for the local default asset
    return Image.resolveAssetSource(defaultProfileImage).uri;
  };

  return (
    <ProfileContext.Provider value={{ profileImage: getDisplayProfileImage(), setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};