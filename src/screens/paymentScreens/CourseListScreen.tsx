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