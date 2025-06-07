import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Get screen width for responsive styling
const { width } = Dimensions.get('window');

// Define the props interface for the CourseCard component
interface CourseCardProps {
  title: string;
  description: string;
  iconRender: () => React.ReactNode; // A function that returns a React node (e.g., JSX)
  backgroundColor?: string; // Optional background color
  contentBackgroundColor?: string; // Optional content background color
}

// A reusable Card component
const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  iconRender,
  backgroundColor,
  contentBackgroundColor,
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Left section for the icon/image, now renders a flexible icon content */}
      <View style={[styles.iconSection, { backgroundColor: backgroundColor || '#FF3A65' }]}>
        {iconRender()} {/* Render the icon provided by the parent component */}
      </View>

      {/* Right section for the text content */}
      <View style={[styles.contentSection, { backgroundColor: contentBackgroundColor || '#FFF0F5' }]}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </View>
  );
};

// Main App component to display the cards
const CustomCard1: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Courses</Text>

      {/* First Card: Online Courses */}
      <CourseCard
        title="Online Self-help Courses"
        description="On option Trading With Quizzes!"
        // Using Text components to simulate the "ONLINE COURSE" label
        iconRender={() => (
          <View style={styles.onlineCourseIconWrapper}>
            <Text style={styles.onlineCourseTextPrimary}>ONLINE</Text>
            <Text style={styles.onlineCourseTextSecondary}>COURSE</Text>
          </View>
        )}
        backgroundColor="#FF3A65"
        contentBackgroundColor="#FFF0F5"
      />

      {/* Second Card: Quick Videos */}
      <CourseCard
        title="Quick Videos"
        description="Learn about stocks, Mutual funds, IPOs, Gold and more"
        // Using a large play button emoji
        iconRender={() => (
          <Text style={styles.playIcon}>▶️</Text>
        )}
        backgroundColor="#FF3A65"
        contentBackgroundColor="#FFF0F5"
      />
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light grey background
    alignItems: 'center', // Center content horizontally
    paddingTop: 50, // Add some top padding
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row', // Arrange icon and content side by side
    width: width * 0.9, // 90% of screen width
    minHeight: 150, // Minimum height for the card
    borderRadius: 20, // Rounded corners for the whole card
    overflow: 'hidden', // Ensures inner elements respect border radius
    marginBottom: 20, // Space between cards
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 }, // iOS shadow
    shadowOpacity: 0.1, // iOS shadow
    shadowRadius: 6, // iOS shadow
  },
  iconSection: {
    flex: 0.4, // Takes 40% of the card width
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  // Styles for the "ONLINE COURSE" text icon simulation
  onlineCourseIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', // Slightly transparent background for the text box
  },
  onlineCourseTextPrimary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  onlineCourseTextSecondary: {
    fontSize: 16,
    color: 'white',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Styles for the play button emoji
  playIcon: {
    fontSize: 60, // Large size for the emoji
    color: 'white', // White color for the emoji
  },
  contentSection: {
    flex: 0.6, // Takes 60% of the card width
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default CustomCard1;
