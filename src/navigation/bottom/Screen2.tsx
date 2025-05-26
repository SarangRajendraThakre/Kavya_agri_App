// Screen2.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'; // For tab-specific props
import { NativeStackScreenProps } from '@react-navigation/native-stack'; // For stack-specific props
import { CompositeScreenProps } from '@react-navigation/native'; // To combine prop types

// Import your RootTabParamList and RootStackParamList from types.ts
import { RootTabParamList, RootStackParamList } from '../types'; // Adjust path if types.ts is elsewhere
import { Colors, Fonts } from '../../utils/Constants';

// Define the primary props for Screen2 as a tab screen
type Screen2TabProps = BottomTabScreenProps<RootTabParamList, 'Screen2'>;

// Define the composite props for Screen2:
// It's a tab screen (Screen2TabProps) AND it needs to access the main stack navigator (NativeStackScreenProps<RootStackParamList>)
type Screen2Props = CompositeScreenProps<
  Screen2TabProps, // Primary props for this screen (from Bottom Tabs)
  NativeStackScreenProps<RootStackParamList> // Access to the main stack navigator
>;

const Screen2: React.FC<Screen2Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('PlayGame');
        }}
      >
        <Text style={styles.buttonText}>Go to PlayGame</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Screen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: Fonts.SatoshiBold,
    color: Colors.text,
  },
});