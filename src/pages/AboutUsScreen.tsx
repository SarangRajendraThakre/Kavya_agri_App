import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform, // Needed for Platform.OS in fontR
  StatusBar, // Not directly used in this component, but good to have if you need it later
} from 'react-native';

// --- START: Your Scaling Utilities (Copied directly from your input) ---
import {RFValue} from 'react-native-responsive-fontsize';
import {Dimensions} from 'react-native'; // Import Dimensions here as it's used in the scaling utils

// Get window dimensions once and assign to clearly named local variables
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

// Export raw dimensions for direct use where needed (e.g., screenWidth, screenHeight)
export const screenWidth: number = windowWidth;
export const screenHeight: number = windowHeight;

// Base dimensions from your design
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Text scaling using RFValue with platform adjustment
export const fontR = (fontSize: number): number => {
  return Platform.OS === 'android' ? RFValue(fontSize + 2) : RFValue(fontSize);
};

// Horizontal scaling
export const scale = (size: number): number =>
  (windowWidth / guidelineBaseWidth) * size;

// Vertical scaling
export const verticalScale = (size: number): number =>
  (windowHeight / guidelineBaseHeight) * size;

// Moderate horizontal scaling
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

// Moderate vertical scaling
export const moderateScaleVertical = (size: number, factor = 0.5): number =>
  size + (verticalScale(size) - size) * factor;

// Keep textScale only if you have a specific non-RFValue use case.
// Otherwise, it's generally best to consistently use fontR for all text.
export const textScale = (size: number): number => {
  return Math.round((size * windowHeight) / guidelineBaseHeight);
};
// --- END: Your Scaling Utilities ---

const AboutUsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.whoWeAreText}>WHO WE ARE</Text>
          <Text style={styles.mainTitle}>
            For <Text style={styles.highlightText}>teams,</Text> by{' '}
            <Text style={styles.highlightText}>teams</Text>
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.paragraph}>
            At <Text style={styles.boldText}>Kavya Agri Innovation</Text>, we're
            passionate about cultivating careers in agriculture. We don't just
            offer training; we provide the professional guidance and hands-on
            expertise you need to truly thrive. Our mission is to empower
            aspiring professionals with the cutting-edge skills and deep
            knowledge that open doors to rewarding job opportunities. Join us,
            and let's grow your success together in the dynamic world of
            agriculture!
          </Text>

          <Text style={styles.paragraph}>
            That's why we built  
            <Text style={styles.boldText}> Kavya Agri Innovation</Text> –Our
            programs are designed to streamline your path to meaningful
            employment and foster sustainable career growth within the vital
            agriculture industry.
      
          </Text>
        </View>

        {/* You can add an image or a decorative element here if you like,
            similar to the arc in your original image.
        */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2F4F4F', // Dark Slate Gray, similar to your image background
  },
  container: {
    flexGrow: 1,
    paddingVertical: verticalScale(30), // Applied vertical scaling
    paddingHorizontal: scale(20), // Applied horizontal scaling
  },
  headerSection: {
    marginBottom: verticalScale(40), // Applied vertical scaling
  },
  whoWeAreText: {
    fontSize: fontR(14), // Applied fontR for text scaling
    fontWeight: 'bold',
    color: '#A9A9A9', // Dark Gray
    marginBottom: verticalScale(10), // Applied vertical scaling
    letterSpacing: scale(1.5), // Applied horizontal scaling for letter spacing
  },
  mainTitle: {
    fontSize: fontR(36), // Applied fontR for text scaling
    fontWeight: 'bold',
    color: '#FFFFFF', // White
    lineHeight: fontR(45), // Applied fontR for line height
  },
  highlightText: {
    color: '#66CDAA', // Medium Aquamarine, similar to the green highlight
  },
  contentSection: {
    marginBottom: verticalScale(30), // Applied vertical scaling
  },
  paragraph: {
    fontSize: fontR(16), // Applied fontR for text scaling
    lineHeight: fontR(24), // Applied fontR for line height
    color: '#D3D3D3', // Light Gray
    marginBottom: verticalScale(20), // Applied vertical scaling
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFFFFF', // White for emphasis
  },
});

export default AboutUsScreen;
