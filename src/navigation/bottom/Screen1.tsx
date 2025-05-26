// Screen1.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
// Import the necessary types for tabs and drawers
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native'; // For combining types
import { RootDrawerParamList, RootTabParamList } from '../types';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Fonts } from '../../utils/Constants';

// Import your RootTabParamList and RootDrawerParamList from types.ts


// 1. Define the primary props for Screen1 as a tab screen
type Screen1TabProps = BottomTabScreenProps<RootTabParamList, 'Screen1'>;

// 2. Define the composite props for Screen1
// This means Screen1 has its Tab navigation props,
// AND it also has access to the Drawer navigation methods (like openDrawer())
type Screen1Props = CompositeScreenProps<
  Screen1TabProps, // Primary props for this screen (from Bottom Tabs)
  DrawerScreenProps<RootDrawerParamList> // Additional props for Drawer functionality
>;

const Screen1: React.FC<Screen1Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        onPress={() => {
          // TypeScript now correctly recognizes openDrawer() because of CompositeScreenProps
          // Make sure this screen is actually nested within a DrawerNavigator in your AppNavigator setup.
          navigation.openDrawer();
        }}
      >
        Open Side Drawer
      </Text>
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  text: {
    fontSize: 20,
    fontFamily: Fonts.SatoshiBold,
    color: Colors.primary,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
});