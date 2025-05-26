// CustomDrawer.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// Import your RootDrawerParamList and other types from types.ts
// Although RootDrawerParamList is not directly used in the type definition here,
// it's essential for the overall type inference of the navigation object.
import { RootDrawerParamList } from '../types'; // Adjust path
import { Colors, Fonts } from '../../utils/Constants';

// CORRECTED: Type the props for CustomDrawer using DrawerContentComponentProps directly.
// It is NOT generic.
type CustomDrawerProps = DrawerContentComponentProps;

const CustomDrawer: React.FC<CustomDrawerProps> = (props) => {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        {/* Your custom header or content */}
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerHeaderText}>My App Menu</Text>
        </View>

        {/* Default drawer items (Home, Screen2, etc.) */}
        <DrawerItemList {...props} />

        {/* Add custom items below default ones */}
        <TouchableOpacity
          style={styles.customItem}
          onPress={() => {
            // Type-safe navigation within the drawer, as props.navigation
            // will correctly infer its type from the context of the Drawer.Navigator
            props.navigation.navigate('Main');
          }}
        >
          <Text style={styles.customItemText}>Custom Link</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Optional: Footer content */}
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
    backgroundColor: Colors.backgroundDark,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: Colors.primary,
    marginBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 22,
    fontFamily: Fonts.SatoshiBold,
    color: Colors.text,
  },
  customItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundLight,
  },
  customItemText: {
    fontSize: 16,
    fontFamily: Fonts.SatoshiRegular,
    color: Colors.text,
  },
  drawerFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundLight,
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: 12,
    color: Colors.inactive,
    fontFamily: Fonts.SatoshiLight,
  },
});