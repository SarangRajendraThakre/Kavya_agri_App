// components/ActionCard.tsx (No changes needed, will use existing or slight modification for button text)
// Original code is fine, just ensure you pass "Register Now" as buttonText
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../utils/Constants';

interface ActionCardProps {
  title: string;
  buttonText: string; // This will be "Register Now"
  onButtonPress: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, buttonText, onButtonPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.button} onPress={onButtonPress} activeOpacity={0.7}>
        <Icon name="account-plus-outline" size={20} color={Colors.textLight || '#FFF'} /> {/* Changed icon */}
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight || '#fff', // A distinct color for the action card
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primaryLighter || '#8E9DFF',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around', // Space out content vertically
    marginHorizontal: 10,
    width: 250, // Same width as ImageCard for consistent look
    height: 180, // Same height
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  title: {
    color: Colors.textLight || '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    // fontFamily: 'YourCustomFont-Bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark || '#5A4CEB', // Darker shade of primary
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.textLight || '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8, // Space between icon and text
    // fontFamily: 'YourCustomFont-Medium',
  },
});

export default ActionCard;