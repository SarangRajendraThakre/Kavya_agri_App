// screens/GoalSettingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../utils/Constants';

const GoalSettingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Goal Setting Screen!</Text>
      {/* Add your actual content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark || '#1A1A1A',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text || '#FFFFFF',
  },
});

export default GoalSettingScreen;