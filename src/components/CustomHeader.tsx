// components/CustomHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native'; // Import DrawerActions
import Ionicons from 'react-native-vector-icons/Ionicons';

import { fontR, moderateScale, scale, verticalScale } from '../utils/Scaling'; // Your scaling utilities

interface CustomHeaderProps {
  title: string;
  showHamburger?: boolean;
  showNotification?: boolean;
  onNotificationPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showHamburger = true,
  showNotification = true,
  onNotificationPress,
}) => {
  const navigation = useNavigation();

  const handleHamburgerPress = () => {
    // Attempt to open the drawer
    // The `dispatch` method with `DrawerActions.openDrawer()` is a more robust way
    // to open the drawer, especially when dealing with nested navigators or
    // when you want to be sure the action is directed at the DrawerNavigator.
    if (navigation.canGoBack()) {
      // If there's a back stack in the current navigator, this might be a back button.
      // You can decide if you want the hamburger to act as a back button OR always open drawer.
      // For a typical DrawerNavigator, the hamburger usually *always* opens the drawer.
      // If you are nesting a StackNavigator INSIDE a Drawer.Screen, then this logic
      // for `goBack()` makes sense for screens deeper in the stack.
      // But if it's the main screen of the Drawer, it should open the drawer.

      // Let's modify this for typical drawer behavior:
      // If on the *initial screen* of the drawer stack, open the drawer.
      // If deep in a *nested stack inside a drawer screen*, show a back arrow (but your current header doesn't change icon).
      // For a consistent hamburger: always try to open the drawer.
      navigation.dispatch(DrawerActions.openDrawer());

    } else {
      // If there's no back stack, definitely open the drawer.
      navigation.dispatch(DrawerActions.openDrawer());
    }

    // A simpler, often more robust approach for a fixed hamburger:
    // navigation.dispatch(DrawerActions.openDrawer());
    // You can remove the `if (navigation.canGoBack())` check if you *always* want the hamburger to open the drawer
    // regardless of the current stack depth.
  };

  return (
    <View style={styles.headerContainer}>
      {showHamburger && (
        <TouchableOpacity onPress={handleHamburgerPress} style={styles.iconButton}>
          <Ionicons name="menu" size={moderateScale(28)} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      {!showHamburger && <View style={styles.emptySpace} />}

      <Text style={styles.headerTitle}>{title}</Text>

      {showNotification && (
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
          <Ionicons name="notifications" size={moderateScale(26)} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      {!showNotification && <View style={styles.emptySpace} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#282C34',
    height: verticalScale(70),
    paddingHorizontal: scale(10),
   
  },
  iconButton: {
    padding: moderateScale(5),
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: fontR(15),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  emptySpace: {
    width: moderateScale(38),
  },
});

export default CustomHeader;