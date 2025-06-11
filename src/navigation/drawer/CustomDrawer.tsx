// CustomDrawer.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Platform, Alert } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

// Import your RootDrawerParamList and other types from types.ts
import { RootDrawerParamList } from '../types'; // Adjust path as needed

// Import your constants
import { Colors, Fonts } from '../../utils/Constants'; // Adjust path
import Sidemenusection from '../../components/Sidemenusection'; // Adjust path if needed

// Import your responsive utilities
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  screenWidth,
  fontR,
  scale,
  verticalScale,
  moderateScale,
} from '../../utils/Scaling'; // Adjust path
import { navigate, resetAndNavigate } from '../../utils/NavigationUtils';
import { storage } from '../../utils/storage'; // Assuming 'storage' is your MMKV instance
import { CommonActions } from '@react-navigation/native';

// --- ProfileMenuItem (Optimized for Drawer) ---
interface ProfileMenuItemProps {
  iconName: string;
  title: string;
  description?: string;
  showWarning?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isLastInGroup?: boolean;
  onPress?: () => void;
}

const CustomProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  iconName,
  title,
  description,
  showWarning = false,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  isLastInGroup = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        profileStyles.menuItem,
        isLastInGroup && profileStyles.noBorderBottom,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={profileStyles.menuItemLeft}>
        <Icon name={iconName} size={moderateScale(20)} color={Colors.primary || '#6C63FF'} />
        <View style={profileStyles.menuItemTextContainer}>
          <Text style={profileStyles.menuItemTitle}>{title}</Text>
          {description && (
            <Text style={profileStyles.menuItemDescription}>{description}</Text>
          )}
        </View>
      </View>
      <View style={profileStyles.menuItemRight}>
        {showWarning && (
          <Icon name="alert-circle-outline" size={moderateScale(20)} color={Colors.warning || '#FF6347'} style={profileStyles.warningIcon} />
        )}
        {isSwitch ? (
          <Switch
            trackColor={{ false: Colors.inactive || '#D3D3D3', true: Colors.primaryLighter || '#8E9DFF'} /* Keep colors if they are correct */ }
            thumbColor={switchValue ? Colors.primary || '#6C63FF' : Colors.backgroundLight || '#f4f3f4'}
            ios_backgroundColor={Colors.backgroundLight || '#E0E0E0'}
            onValueChange={onSwitchChange}
            value={switchValue}
            transform={[{ scaleX: moderateScale(0.8) }, { scaleY: moderateScale(0.8) }]}
          />
        ) : (
          <Icon name="chevron-right" size={moderateScale(20)} color={Colors.inactive || '#A0A0A0'} />
        )}
      </View>
    </TouchableOpacity>
  );
};

// --- CustomDrawer Component ---
type CustomDrawerProps = DrawerContentComponentProps;

const CustomDrawer: React.FC<CustomDrawerProps> = (props) => {
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  // State variables to hold the dynamic data
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [appId, setAppId] = useState<string>(''); // For the profile handle


  // A simple alert function (for demonstration)
  const showAlert = (message: string) => {
    // console.log(message); // Log for debugging
    // Alert.alert('Action', message); // Uncomment if react-native's Alert is available
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          onPress: () => {
            // Clear ALL MMKV data
            storage.clearAll(); // This line clears all data in your MMKV instance

            // Use your utility function for navigation
            resetAndNavigate('OnboardingScreen'); // Correct usage
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // --- MODIFIED useEffect to load data from MMKV using direct keys ---
  useEffect(() => {
    const loadProfileDirectly = () => {
      // Retrieve values directly using their specific keys
      setFirstName(storage.getString('firstName') || 'Guest');
      console.log(firstName);
      setLastName(storage.getString('lastName') || 'User');
      setAppId(storage.getString('appId') || 'unknown'); // Use a specific key for appId/username
    };

    loadProfileDirectly();
    // No dependencies means this runs once after initial render.
    // If these values can change while the drawer is open and you want it to update,
    // you might need a way to trigger this effect (e.g., a context update).
  }, []);

  return (
    <View style={styles.container}>
      {/* Drawer Header (Profile Card style - optimized) */}
      <View style={profileStyles.profileCardCustomDrawer}>
        <Image
          source={require('../../assets/images/SARANGTHAKRE.jpg')} // Keep this static for now, or make dynamic later
          style={profileStyles.profileImage}
        />
        <View style={profileStyles.profileInfo}>
          <Text style={profileStyles.profileName}>
            {firstName} {lastName} {/* <--- Display dynamic first and last name */}
          </Text>
          <Text style={profileStyles.profileHandle}>
            @{appId} {/* <--- Display dynamic appId */}
          </Text>
        </View>
        <TouchableOpacity style={profileStyles.editButton}  onPress={() => props.navigation.navigate('ProfileEditScreen')}>
          <Icon name="pencil" size={moderateScale(14)} color="#FFF" />
        </TouchableOpacity>
      </View>

      <DrawerContentScrollView {...props} style={styles.drawerScrollView}>
        {/* Main Menu Section (using CustomProfileMenuItem) */}
        <View style={profileStyles.menuSectionCustomDrawer}>
          <CustomProfileMenuItem
            iconName="account-outline"
            title="My Profile"
            onPress={() => props.navigation.navigate('ProfileEditScreen')}
          />
          <CustomProfileMenuItem
            iconName="bookmark-outline"
            title="Explore"
            onPress={() => props.navigation.navigate('MainTabs', { screen: 'Explore' })}
          />

          <CustomProfileMenuItem
            iconName="shield-lock-outline"
            title="Certificate"
            onPress={() => showAlert('Navigate to Two-Factor Auth')}
          />
          <CustomProfileMenuItem
            iconName="shield-lock-outline"
            title="Refer"
            onPress={() => showAlert('Navigate to Two-Factor Auth')}
          />
     
        </View>

        {/* More Section (using CustomProfileMenuItem) */}
        <View style={profileStyles.moreSectionCustomDrawer}>
          <Text style={profileStyles.moreSectionTitle}>More</Text>
          <CustomProfileMenuItem
            iconName="bell-outline"
            title="Help & Support"
            onPress={() => showAlert('Navigate to Help & Support')}
          />
          <CustomProfileMenuItem
            iconName="information-outline"
            title="About App"
            isLastInGroup={true}
            onPress={() => navigate('AboutUsScreen')}
          />
          <CustomProfileMenuItem
            iconName="bookmark-outline"
            title="FAQ"
            onPress={() =>  navigate('FAQScreen') }
          />


          <CustomProfileMenuItem
            iconName="logout"
            title="Log Out"
            isLastInGroup={true}
            onPress={handleLogout}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer content */}
      <View style={styles.drawerFooter}>
        <Text style={styles.drawerFooterText}>Version 1.0</Text>
      </View>
    </View>
  );
};

export default CustomDrawer;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark || '#F0F2F5',
  },
  drawerScrollView: {
    paddingVertical: verticalScale(5),
  },
  drawerFooter: {
    padding: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight || '#E0E0E0',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark || '#F0F2F5',
  },
  drawerFooterText: {
    fontSize: fontR(11),
    color: Colors.inactive || '#A0A0A0',
    fontFamily: Fonts.SatoshiLight || 'System',
  },
});

const profileStyles = StyleSheet.create({
  profileCardCustomDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary || '#6C63FF',
    borderRadius: moderateScale(15),
    marginHorizontal: scale(10),
    marginVertical: verticalScale(15),
    padding: moderateScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(8),
    elevation: 6,
  },
  profileImage: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(27.5),
    marginRight: scale(15),
    borderWidth: moderateScale(2),
    borderColor: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontR(17),
    fontWeight: 'bold',
    color: Colors.textLight || '#FFF',
  },
  profileHandle: {
    fontSize: fontR(13),
    color: Colors.primaryLighter || '#E0E0FF',
    marginTop: verticalScale(2),
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
  },
  menuSectionCustomDrawer: {
    backgroundColor: Colors.cardBackground || '#fff',
    marginHorizontal: scale(10),
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(4),
    elevation: 3,
    marginBottom: verticalScale(15),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight || '#F0F0F0',
  },
  noBorderBottom: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    marginLeft: scale(15),
  },
  menuItemTitle: {
    fontSize: fontR(15),
    color: Colors.textDark || '#333',
    fontFamily: Fonts.SatoshiMedium || 'System',
    fontWeight: '500',
  },
  menuItemDescription: {
    fontSize: fontR(11),
    color: Colors.textMuted || '#888',
    marginTop: verticalScale(2),
    lineHeight: fontR(14),
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: scale(8),
  },
  moreSectionCustomDrawer: {
    backgroundColor: Colors.cardBackground || '#fff',
    marginHorizontal: scale(10),
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(4),
    elevation: 3,
    marginBottom: verticalScale(15),
  },
  moreSectionTitle: {
    fontSize: fontR(14),
    color: Colors.textMuted || '#666',
    fontFamily: Fonts.SatoshiBold || 'System',
    fontWeight: 'bold',
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(8),
    marginTop: verticalScale(5),
  },
});