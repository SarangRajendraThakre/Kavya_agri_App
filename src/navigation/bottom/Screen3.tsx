// screens/HomeScreen.tsx (or App.js, or any other screen component)

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import CustomBannerCarousel from '../../components/CustomBannerCarousel';

// Import your images (replace with your actual image paths)
const bannerImage1 = require('../../assets/images/HomePageTopBanner/ExploretheWorldofAgriCareer1.jpg');
const bannerImage2 = require('../../assets/images/HomePageTopBanner/ExploretheWorldofAgriCareer2.jpg');
const bannerImage3 = require('../../assets/images/HomePageTopBanner/ExploretheWorldofAgriCareer3.jpg');
const bannerImage4 = require('../../assets/images/HomePageTopBanner/Explore.Learn.Grow.Let’sbuildyouragriculturecareertogether.jpg');

const Screen3 = () => {
  // 1. Prepare your data for the carousel
  const carouselData = [
    { id: '1', image: bannerImage1 },
    { id: '2', image: bannerImage2 },
    { id: '3', image: bannerImage3 },
    { id: '4', image: bannerImage4 }
  
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Your other screen content can go here */}
        <Text style={styles.sectionTitle}>Welcome to Kavya Agri App</Text>

        {/* 2. & 3. Render the CustomBannerCarousel component */}
        <CustomBannerCarousel data={carouselData} />

        {/* More content below the carousel */}
        <Text style={styles.anotherSectionTitle}>Explore our Services</Text>
        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderText}>
            This is placeholder content below the carousel. You can add more sections, cards, or lists here.
          </Text>
        </View>
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
});

export default Screen3;