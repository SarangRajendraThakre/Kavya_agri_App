// components/CareerCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CareerCardProps {
  title: string;
  onPress: () => void;
  // You can add more props like an iconName if you want to include icons
  // iconName?: string;
}

const CareerCard: React.FC<CareerCardProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* If you add an icon, you'd place it here, e.g., <Icon name={iconName} size={30} color="#fff" /> */}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222222', // Dark background similar to the image
    borderRadius: 12, // Slightly rounded corners
    borderWidth: 1.5,
    borderColor: '#444444', // Subtle border
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10, // Spacing between cards
    flex: 1, // Allows cards to take equal space in a row/column
    minWidth: '42%', // Adjust for 2 cards per row on smaller screens
    maxWidth: '46%', // Adjust for 2 cards per row on larger screens
    aspectRatio: 1, // Keep cards square or adjust as needed
    elevation: 5, // Subtle shadow for Android
    shadowColor: '#000', // Shadow properties for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  title: {
    color: '#EEEEEE', // Light text color
    fontSize: 16,
    fontWeight: '600', // Medium bold
    textAlign: 'center',
    // fontFamily: 'YourCustomFont-Medium', // Replace with your actual custom font
  },
});

export default CareerCard;