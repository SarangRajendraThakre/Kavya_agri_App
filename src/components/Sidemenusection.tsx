import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your responsive utility functions
import {
  screenWidth,
  screenHeight,
  fontR,
  scale,
  verticalScale,
  moderateScale,
  moderateScaleVertical,
} from '../utils/Scaling'; // Adjust path if your utils file is elsewhere

const ProfileScreen: React.FC = () => {
  const [faceIdEnabled, setFaceIdEnabled] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual user image
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Itunuoluwa Abidoye</Text>
          <Text style={styles.profileHandle}>@itunuoluwa</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          {/* Using AntDesign icon for a sharper pencil, or stick to MaterialCommunityIcons */}
          <Icon name="pencil" size={moderateScale(16)} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Menu Section */}
      <View style={styles.menuSection}>
        <Sidemenusection
          iconName="account-outline"
          title="My Account"
          description="Make changes to your account"
          showWarning={true}
        />
        <Sidemenusection
          iconName="bookmark-outline"
          title="Saved Beneficiary"
          description="Manage your saved account"
        />
        <Sidemenusection
          iconName="face-recognition"
          title="Face ID / Touch ID"
          description="Manage your device security"
          isSwitch={true}
          switchValue={faceIdEnabled}
          onSwitchChange={setFaceIdEnabled}
        />
        <Sidemenusection
          iconName="shield-lock-outline"
          title="Two-Factor Authentication"
          description="Further secure your account for safety"
        />
        <Sidemenusection
          iconName="logout"
          title="Log out"
          description="Further secure your account for safety"
          isLastInGroup={true} // Mark last item to remove bottom border
        />
      </View>

      {/* More Section */}
      <View style={styles.moreSection}>
        <Text style={styles.moreSectionTitle}>More</Text>
        <Sidemenusection
          iconName="bell-outline"
          title="Help & Support"
        />
        <Sidemenusection
          iconName="information-outline"
          title="About Us"
          isLastInGroup={true} 
          
        />
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0</Text>
      </View>
    </SafeAreaView>
  );
};

// Reusable Component for Menu Items
interface ProfileMenuItemProps {
  iconName: string;
  title: string;
  description?: string;
  showWarning?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isLastInGroup?: boolean; // New prop to handle last item border
}

const Sidemenusection: React.FC<ProfileMenuItemProps> = ({
  iconName,
  title,
  description,
  showWarning = false,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  isLastInGroup = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isLastInGroup && styles.noBorderBottom // Apply style if it's the last item
      ]}
      activeOpacity={0.7} // Reduce opacity more on press
    >
      <View style={styles.menuItemLeft}>
        <Icon name={iconName} size={moderateScale(22)} color="#6C63FF" /> {/* Softer icon color */}
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {description && (
            <Text style={styles.menuItemDescription}>{description}</Text>
          )}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {showWarning && (
          <Icon name="alert-circle-outline" size={moderateScale(22)} color="#FF6347" style={styles.warningIcon} /> 
        )}
        {isSwitch ? (
          <Switch
            trackColor={{ false: '#D3D3D3', true: '#8E9DFF' }} // Lighter track, richer active color
            thumbColor={switchValue ? '#6C63FF' : '#f4f3f4'} // Richer thumb color
            ios_backgroundColor="#E0E0E0"
            onValueChange={onSwitchChange}
            value={switchValue}
          />
        ) : (
          <Icon name="chevron-right" size={moderateScale(22)} color="#A0A0A0" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Soft, light gray background
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF', // A slightly more vibrant purple/blue
    borderRadius: moderateScale(20), // Larger border radius
    marginHorizontal: scale(20),
    marginVertical: verticalScale(25), // More vertical space
    padding: moderateScale(20), // More padding inside
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(6) }, // Softer, more spread shadow
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(10),
    elevation: 8, // Higher elevation for Android shadow
  },
  profileImage: {
    width: scale(64), // Slightly larger image
    height: scale(64),
    borderRadius: scale(32),
    marginRight: scale(18), // More space
    borderWidth: moderateScale(3), // Slightly thicker border
    borderColor: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontR(19), // Slightly larger font
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileHandle: {
    fontSize: fontR(14),
    color: '#E0E0FF', // Lighter handle text for contrast
    marginTop: verticalScale(2),
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)', // More transparent
    padding: moderateScale(10), // More padding
    borderRadius: moderateScale(25), // More rounded
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: scale(20),
    borderRadius: moderateScale(15), // Consistent border radius
    paddingVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) }, // Consistent shadow style
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(8),
    elevation: 5,
    marginBottom: verticalScale(20), // Space between sections
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(18), // Increased vertical padding for spaciousness
    paddingHorizontal: scale(15),
    borderBottomWidth: StyleSheet.hairlineWidth, // Thin separator
    borderBottomColor: '#F0F0F0', // Very light separator
  },
  noBorderBottom: {
    borderBottomWidth: 0, // Style for the last item in a group
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    marginLeft: scale(18), // More space
  },
  menuItemTitle: {
    fontSize: fontR(16),
    color: '#333',
    fontWeight: '500', // Slightly bolder for professionalism
  },
  menuItemDescription: {
    fontSize: fontR(12),
    color: '#888', // Softer grey
    marginTop: verticalScale(4), // More space below title
    lineHeight: fontR(16), // Ensures good line height for descriptions
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: scale(10),
  },
  moreSection: {
    backgroundColor: '#fff',
    marginHorizontal: scale(20),
    borderRadius: moderateScale(15),
    paddingVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(8),
    elevation: 5,
    marginBottom: verticalScale(20), // Space below the last section
  },
  moreSectionTitle: {
    fontSize: fontR(15), // Slightly larger font for section title
    color: '#666', // Softer grey for section title
    fontWeight: 'bold',
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(5), // Add a little top margin
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: verticalScale(30), // Ample space from last card
    marginBottom: verticalScale(10),
  },
  versionText: {
    fontSize: fontR(12),
    color: '#A0A0A0', // Subtle version text
  },
});

export default Sidemenusection;