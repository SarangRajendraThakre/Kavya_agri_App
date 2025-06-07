// screens/CourseListScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
// We no longer need useNavigation or specific StackNavigationProp imports here
// because we're using the centralized navigation service.
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

import { Course } from '../../navigation/types'; // Import your Course type
import { navigate } from '../../utils/NavigationUtils';
import CourseCard from './CourseCard';

// --- Dummy Course Data ---
// In a real application, this data would typically come from an API call.
const DUMMY_COURSES: Course[] = [
  {
    id: '1',
    title: 'React Native Basics',
    description: 'Learn the fundamentals of building mobile apps with React Native, covering components, styling, and navigation.',
    price: 2,
    imageUrl: 'https://huroorkee.ac.in/blog/wp-content/uploads/2024/03/Govt-Jobs-After-B.Sc_.-Agriculture.jpg',
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Dive deep into JavaScript concepts like closures, promises, async/await, and functional programming.',
    price: 2,
    imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/17/41/javascript-736400_1280.png',
  },
  {
    id: '3',
    title: 'Full Stack Development',
    description: 'Master building end-to-end web applications using MERN stack (MongoDB, Express, React, Node.js).',
    price: 2,
    imageUrl: 'https://d2ms8rpfqc4h24.cloudfront.net/Guide_to_Full_Stack_Development_000eb0b2d0.jpg',
  },
   {
    id: '4',
    title: 'Python for Data Science',
    description: 'An introduction to Python programming for data analysis, manipulation, and visualization.',
    price: 1,
    imageUrl: 'https://www.ku.edu.bh/wp-content/uploads/2023/06/Python-e1687965207655.gif',
  },
  {
    id: '5',
    title: 'AWS Cloud Practitioner',
    description: 'Prepare for the AWS Certified Cloud Practitioner exam and understand core AWS services.',
    price: 1,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpcUZNRONjFQplFMKLMepyQbPnhy7TfkijKg&s',
  },
  {
    id: '6',
    title: 'Mobile App UI/UX Design',
    description: 'Learn principles of user interface and user experience design specifically for mobile applications.',
    price: 1,
    imageUrl: 'https://existek3-838c.kxcdn.com/wp-content/uploads/2022/08/5-6.webp',
  },
];

const CourseListScreen: React.FC = () => {
  // The CourseListScreenProps type is useful if this component receives props directly from the navigator.
  // However, since we're using a navigation service to trigger navigation actions,
  // the component itself doesn't explicitly need those props unless it needs to access route.params or navigation methods directly.
  // For this component, React.FC<object> or just React.FC is sufficient for now.

  const handleCardPress = (course: Course) => {
    // Use the centralized navigation service to navigate to CourseDetail.
    // Ensure 'CourseDetail' is correctly defined in your RootDrawerParamList (or relevant ParamList).
  navigate('CourseDetail', { course: course });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Available Courses</Text>
        <FlatList
          data={DUMMY_COURSES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={handleCardPress} />
          )}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background for the safe area
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Handle Android status bar
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Consistent background
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    textAlign: 'center',
    backgroundColor: '#FFFFFF', // Header background for better separation
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default CourseListScreen;