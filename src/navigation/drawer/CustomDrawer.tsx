// CustomDrawer.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  // DrawerItemList, // We're not using DrawerItemList directly for these custom sections
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
import { navigate } from '../../utils/NavigationUtils';

// --- ProfileMenuItem (Optimized for Drawer) ---
interface ProfileMenuItemProps {
  iconName: string;
  title: string;
  description?: string; // Keep description but maybe use shorter ones
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
        <Icon name={iconName} size={moderateScale(20)} color={Colors.primary || '#6C63FF'} /> {/* Slightly smaller icon */}
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
            trackColor={{ false: Colors.inactive || '#D3D3D3', true: Colors.primaryLighter || '#8E9DFF' }}
            thumbColor={switchValue ? Colors.primary || '#6C63FF' : Colors.backgroundLight || '#f4f3f4'}
            ios_backgroundColor={Colors.backgroundLight || '#E0E0E0'}
            onValueChange={onSwitchChange}
            value={switchValue}
            // Scale switch for better touch area if needed, though often system controlled
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
  const [faceIdEnabled, setFaceIdEnabled] = React.useState(false);

  // A simple alert function (for demonstration)
  const showAlert = (message: string) => {
    // Replace with a proper alert or navigation if needed
    // console.log(message); // Log for debugging
    // Alert.alert('Action', message); // Uncomment if react-native's Alert is available
  };

  return (
    <View style={styles.container}>
      {/* Drawer Header (Profile Card style - optimized) */}
      <View style={profileStyles.profileCardCustomDrawer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Your profile image
          style={profileStyles.profileImage}
        />
        <View style={profileStyles.profileInfo}>
          <Text style={profileStyles.profileName}>Itunuoluwa Abidoye</Text>
          <Text style={profileStyles.profileHandle}>@itunuoluwa</Text>
        </View>
        <TouchableOpacity style={profileStyles.editButton} onPress={() => showAlert('Edit Profile')}>
          <Icon name="pencil" size={moderateScale(14)} color="#FFF" /> {/* Smaller edit icon */}
        </TouchableOpacity>
      </View>

      <DrawerContentScrollView {...props} style={styles.drawerScrollView}>
        {/* Main Menu Section (using CustomProfileMenuItem) */}
        <View style={profileStyles.menuSectionCustomDrawer}>
          <CustomProfileMenuItem
            iconName="account-outline"
            title="My Profile"
            // description="Make changes to your account" // Consider removing description for drawer
            onPress={() => props.navigation.navigate('ProfileEditScreen')} // Navigate to Profile screen
          />
          <CustomProfileMenuItem
            iconName="bookmark-outline"
            title="Explore"
            // description="Manage your saved account"
             onPress={() => props.navigation.navigate('MainTabs', { screen: 'Explore' })} // <-- KEY CHANGE HERE
          />
         
          <CustomProfileMenuItem
            iconName="shield-lock-outline"
            title="Certificate" //s Shorter title
            // description="Further secure your account"
            onPress={() => showAlert('Navigate to Two-Factor Auth')}
          />
          <CustomProfileMenuItem
            iconName="shield-lock-outline"
            title="Refer" //s Shorter title
            // description="Further secure your account"
            onPress={() => showAlert('Navigate to Two-Factor Auth')}
          />
          <CustomProfileMenuItem
            iconName="logout"
            title="Log Out" // Shorter title
            // description="Secure your account for safety"
            isLastInGroup={true}
            onPress={() => showAlert('Log out!')}
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
            onPress={() => navigate('AboutUsScreen')} // <--- Use your global navigate for AboutUs
          />
        </View>

        {/* Placeholder for your Sidemenusection if it's meant to be here */}
        {/* <Sidemenusection /> */}
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
    paddingVertical: verticalScale(5), // Reduce overall padding
  },
  drawerFooter: {
    padding: verticalScale(12), // Reduced padding
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight || '#E0E0E0',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark || '#F0F2F5',
  },
  drawerFooterText: {
    fontSize: fontR(11), // Slightly smaller font
    color: Colors.inactive || '#A0A0A0',
    fontFamily: Fonts.SatoshiLight || 'System',
  },
});

// --- Profile-specific Styles (Optimized for Drawer) ---
const profileStyles = StyleSheet.create({
  profileCardCustomDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary || '#6C63FF',
    borderRadius: moderateScale(15), // Slightly smaller radius
    marginHorizontal: scale(10), // Reduced horizontal margin
    marginVertical: verticalScale(15), // Reduced vertical margin
    padding: moderateScale(15), // Reduced padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) }, // Softer shadow
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(8),
    elevation: 6,
  },
  profileImage: {
    width: scale(55), // Smaller image
    height: scale(55),
    borderRadius: scale(27.5),
    marginRight: scale(15), // Reduced margin
    borderWidth: moderateScale(2), // Thinner border
    borderColor: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontR(17), // Slightly smaller font
    fontWeight: 'bold',
    color: Colors.textLight || '#FFF',
  },
  profileHandle: {
    fontSize: fontR(13), // Slightly smaller font
    color: Colors.primaryLighter || '#E0E0FF',
    marginTop: verticalScale(2),
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: moderateScale(8), // Reduced padding
    borderRadius: moderateScale(20),
  },
  menuSectionCustomDrawer: {
    backgroundColor: Colors.cardBackground || '#fff',
    marginHorizontal: scale(10), // Consistent with card margin
    borderRadius: moderateScale(12), // Smaller radius
    paddingVertical: verticalScale(5), // Reduced padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) }, // Lighter shadow
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(4),
    elevation: 3,
    marginBottom: verticalScale(15), // Reduced margin
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15), // Reduced vertical padding for compactness
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
    marginLeft: scale(15), // Consistent margin
  },
  menuItemTitle: {
    fontSize: fontR(15), // Slightly smaller font
    color: Colors.textDark || '#333',
    fontFamily: Fonts.SatoshiMedium || 'System',
    fontWeight: '500',
  },
  menuItemDescription: {
    fontSize: fontR(11), // Much smaller font for description or remove entirely
    color: Colors.textMuted || '#888',
    marginTop: verticalScale(2),
    lineHeight: fontR(14), // Adjusted line height
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: scale(8), // Reduced margin
  },
  moreSectionCustomDrawer: {
    backgroundColor: Colors.cardBackground || '#fff',
    marginHorizontal: scale(10), // Consistent margin
    borderRadius: moderateScale(12), // Smaller radius
    paddingVertical: verticalScale(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(4),
    elevation: 3,
    marginBottom: verticalScale(15),
  },
  moreSectionTitle: {
    fontSize: fontR(14), // Slightly smaller font for section title
    color: Colors.textMuted || '#666',
    fontFamily: Fonts.SatoshiBold || 'System',
    fontWeight: 'bold',
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(8), // Reduced margin
    marginTop: verticalScale(5),
  },
});