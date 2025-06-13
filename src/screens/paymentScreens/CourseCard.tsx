// components/CourseCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Course } from '../../navigation/types';

interface CourseCardProps {
  course: Course; // The course data to display
  onPress: (course: Course) => void; // Callback when the card is pressed
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(course)} // Pass the full course object on press
      activeOpacity={0.7} // Reduce opacity when pressed
    >
      <Image source={{ uri: course.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {' '}
          {/* Limit description to 2 lines */}
          {course.description}
        </Text>
        <Text style={styles.price}>₹{course.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 5, // A bit of horizontal margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    flexDirection: 'row', // Arrange image and text side-by-side
    overflow: 'hidden', // Ensure rounded corners apply to image
  },
  image: {
    width: 120, // Fixed width for the image
    height: '100%', // Take full height of the card
    resizeMode: 'cover', // Cover the area without distortion
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  detailsContainer: {
    flex: 1, // Take remaining space
    padding: 15,
    justifyContent: 'space-between', // Distribute content vertically
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff', // Highlight the price
    alignSelf: 'flex-end', // Align price to the right
  },
});

export default CourseCard;