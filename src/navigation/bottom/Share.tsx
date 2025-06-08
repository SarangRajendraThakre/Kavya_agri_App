// screens/HomeScreen.tsx (or App.js, or any other screen component)

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import CustomBannerCarousel from '../../components/carousel/CustomBannerCarousel';
import CourseDetailScreen from '../../screens/paymentScreens/CourseDetailScreen';
import { navigate } from '../../utils/NavigationUtils';
import CustomDrawer from '../drawer/CustomDrawer';
import CustomHeader from '../../components/CustomHeader';
import FAQScreen from '../../screens/FAQScreen';

// Import your images (replace with your actual image paths)
const bannerImage1 = require('../../assets/images/HomePageTopBanner/ExploretheWorldofAgriCareer1.jpg');
const bannerImage2 = require('../../assets/images/HomePageTopBanner/ExploretheWorldofAgriCareer2.jpg');
const bannerImage3 = require('../../assets/images/HomePageTopBanner/ExploretheWorldofAgriCareer3.jpg');
const bannerImage4 = require('../../assets/images/HomePageTopBanner/Explore.Learn.Grow.Let’sbuildyouragriculturecareertogether.jpg');

  const handleExploreCourses = () => {
    navigate('CourseList'); // 'CourseList' should match the name in your RootDrawerParamList
  };
const Share = () => {
  // 1. Prepare your data for the carousel
  const carouselData = [
    { id: '1', image: bannerImage1 },
    { id: '2', image: bannerImage2 },
    { id: '3', image: bannerImage3 },
    { id: '4', image: bannerImage4 }
  
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader title={'Kavya Agri'}  />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
     
        <CustomBannerCarousel data={carouselData} />

        {/* More content below the carousel */}
        <Text style={styles.anotherSectionTitle}>Explore our Services</Text>
        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderText}>
            This is placeholder content below the carousel. You can add more sections, cards, or lists here.
          </Text>
        </View>

        <Text style={styles.anotherSectionTitle}>Explore our Courses</Text>
        <TouchableOpacity style={styles.exploreButton} onPress={handleExploreCourses}>
          <Text style={styles.exploreButtonText}>View All Courses</Text>
        </TouchableOpacity>
        <FAQScreen/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add some padding at the bottom
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  anotherSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
    color: '#333',
  },
  placeholderContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },

  exploreButton: {
    backgroundColor: '#4CAF50', // A nice green color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20, // Spacing below the button
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
 
});


export default Share;