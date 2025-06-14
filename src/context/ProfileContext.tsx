// Assuming your ProfileContext looks something like this initially
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage'; // Adjust path as needed
import defaultProfileImage from '../assets/images/profileImage.png'; // Import default image here
import { Image } from 'react-native';

interface ProfileContextType {
  profileImage: string; // This should be the URI or path
  setProfileImage: (imageUri: string) => void;
  // ... other profile related states and functions
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImageState] = useState<string>(''); // Initial state

  useEffect(() => {
    // Load profile image from storage when context mounts
    const storedImage = storage.getString('profileImage');
    if (storedImage) {
      setProfileImageState(storedImage);
    } else {
      // If no stored image, use the default image's URI or a placeholder for React Native Image
      // For a local image asset, you usually pass the import directly, but for consistency with URIs,
      // you might need to handle this differently if your Image component expects strictly URIs.
      // For simplicity, let's assume defaultProfileImage is a numeric asset ID or you can make defaultProfileImage a URI.
      setProfileImageState(Image.resolveAssetSource(defaultProfileImage).uri); // Get URI for local asset
    }
  }, []);

  // Function to update profile image and store it
  const setProfileImage = (imageUri: string) => {
    setProfileImageState(imageUri);
    storage.set('profileImage', imageUri);
  };

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
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