// screens/CourseListScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Course } from '../../navigation/types';
import { navigate } from '../../utils/NavigationUtils';
import CourseCard from './CourseCard';

// --- Dummy Course Data ---
const DUMMY_COURSES: Course[] = [
  {
    id: '1',
    title: 'Agri Support Program', // Updated title
    description:
      'Comprehensive support program for modern agriculture techniques, crop management, and market insights.',
    price: 1, // Updated price
    imageUrl:
      'https://kavyaprofiles.s3.ap-south-1.amazonaws.com/profile-images/684bfc3e8146395cc72f4a5a/1749822162124-250668b1-db97-486e-8891-82eb27957bd0-0a806856-a85e-4870-a993-e8624a12932b.jpg',
  },
];

const CourseListScreen: React.FC = () => {
  const handleCardPress = (course: Course) => {
    // Navigate to PaymentDetail screen, passing the course object
    navigate('PaymentDetail', { course: course });
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
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default CourseListScreen;