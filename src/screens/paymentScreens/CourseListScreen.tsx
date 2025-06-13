// screens/CourseListScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Course } from '../../navigation/types';
import { navigate } from '../../utils/NavigationUtils';
import CourseCard from './CourseCard';


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