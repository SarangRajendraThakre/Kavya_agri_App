// ProfileContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface ProfileContextProps {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};