// LeadersCornerScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

// Import your scaling utilities
// Make sure this path is correct relative to your project structure
import {
  fontR,
  scale,
  verticalScale,
  moderateScale,
} from '../../utils/Scaling';

// Import your CustomHeader component
// Make sure this path is correct relative to your project structure
import CustomHeader from '../../components/CustomHeader';

// Define your color palette - Enhanced for more vibrance and depth
const Colors = {
  primaryGreen: '#4CAF50', // Main accent color
  darkText: '#212121', // Even darker for higher contrast
  subtleText: '#5A5A5A', // Slightly darker subtle text for better readability
  white: '#FFFFFF',
  lightGrayBackground: '#F8F9FA', // Brighter, cleaner background
  cardBackground: '#FFFFFF', // Still defined, though not used for leader cards
  accentBlue: '#2196F3', // A brighter, more modern blue
  borderColor: '#E0E0E0', // Still defined, though not used in this simplified screen
  checkIcon: '#4CAF50', // A strong, clear green for checkmarks
  gradientStart: '#E0F7FA', // Very light cyan/teal for a fresh header
  gradientEnd: '#B2EBF2', // Slightly darker cyan for depth
  shadowColor: 'rgba(0, 0, 0, 0.18)', // More pronounced and general shadow color
  glowGreen: 'rgba(76, 175, 80, 0.4)', // For the subtle border glow
};

const LeadersCornerScreen = () => {
  // Helper function to render each bullet point with an icon
  const renderPoint = (text: string) => (
    <View style={styles.pointRow}>
      {/* Changed icon for a more 'badge' look */}
      <Icon name="check-decagram" size={fontR(20)} color={Colors.checkIcon} style={styles.checkIcon} />
      <Text style={styles.pointText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header component */}
      <CustomHeader title="Leader's Corner" />

      {/* Main scrollable content area */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* Enhanced Header Section - More Vibrant and Inviting */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.headerSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Hero Icon (Example: a growth, leadership, or success icon) */}
          {/* You can change "medal" to "account-group", "lightbulb-on", etc., or replace with your own image */}
          <Icon name="medal" size={fontR(65)} color={Colors.primaryGreen} style={styles.headerIcon} />

          {/* Main Title */}
          <Text style={styles.mainTitle}>Meet Our Visionary Leadership</Text>

          {/* Tagline/Slogan */}
          <Text style={styles.taglineText}>
            Guiding Your Journey in Agriculture with Unmatched Expertise.
          </Text>

          {/* A subtle visual divider */}
          <View style={styles.separator} />

          {/* Descriptive text with highlighted phrases */}
          <Text style={styles.descriptionText}>
            Our leadership team comprises <Text style={styles.highlightText}>seven seasoned professionals</Text>, each boasting over <Text style={styles.highlightText}>6+ year to 15 years of dedicated, hands-on experience</Text> within the dynamic agriculture industry.
          </Text>
          <Text style={styles.descriptionText}>
            More than just experts, they are <Text style={styles.boldText}>passionate educators</Text> deeply committed to empowering your learning journey.
          </Text>
          <Text style={styles.descriptionText}>
            Each leader commands expertise in a dedicated department of agriculture, conducting exclusive <Text style={styles.highlightText}>in-depth training sessions</Text> to equip you with comprehensive knowledge, invaluable industry insights, and career-ready skills.
          </Text>
        </LinearGradient>

        {/* Highlighted Points Section - Floating Card with Subtle Glow */}
        <View style={styles.pointsSection}>
          {/* Title for the bullet points section */}
          <Text style={styles.pointsSectionTitle}>What Makes Our Leaders Exceptional:</Text>

          {/* Render bullet points */}
          {renderPoint('6+ years of specialized industry experience')}
          {renderPoint('Experts in Agri Input, Private Banking, Organic Certification, Agronomy, Post-harvest Management, Horticulture, and more')}
          {renderPoint("Proven track record of working with leading agri-companies, startups, and MNC's ")}
          {renderPoint('Strong focus on real-life case studies, practical field knowledge, and job-oriented training')}
          {renderPoint('Helping you to become industry-ready and confident')}
        </View>

        {/* Optional: Add more engaging sections here if desired, e.g., "Our Philosophy" */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomSectionText}>
            "Guiding your growth with expertise and passion."
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// StyleSheet for the component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightGrayBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20), // Adds space at the bottom for scrolling content
  },
  headerSection: {
    paddingHorizontal: moderateScale(30), // Even more padding
    paddingVertical: verticalScale(40), // More vertical padding for a grander feel
    marginBottom: verticalScale(20), // More margin below the header
    borderBottomLeftRadius: 40, // Larger, softer radius
    borderBottomRightRadius: 40, // Larger, softer radius
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 8 }, // More pronounced shadow
    shadowOpacity: 0.25, // Increased opacity
    shadowRadius: 12, // Larger, softer radius
    elevation: 12, // Stronger elevation (Android)
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: verticalScale(20), // Space below the icon
    // You could also add a subtle rotation or scale animation here on component mount
  },
  mainTitle: {
    fontSize: fontR(28), // Even larger, more commanding title
    fontWeight: '800', // Extra bold
    color: Colors.darkText,
    textAlign: 'center',
    marginBottom: verticalScale(8), // Reduced margin for tagline
    // fontFamily: 'Poppins-ExtraBold', // Uncomment if you have this font
  },
  taglineText: {
    fontSize: fontR(17), // Size for tagline
    color: Colors.accentBlue, // A distinct color for the tagline
    textAlign: 'center',
    marginBottom: verticalScale(25), // Space below tagline
    // fontFamily: 'Poppins-SemiBold', // Or a slightly lighter font for contrast
    fontStyle: 'italic', // Gives it a nice touch
  },
  separator: {
    width: moderateScale(60), // Width of the separator line
    height: verticalScale(3), // Thickness of the separator line
    backgroundColor: Colors.primaryGreen, // Color of the separator
    borderRadius: 2, // Rounded ends for the separator
    marginBottom: verticalScale(25), // Space below the separator
    alignSelf: 'center', // Center the separator
  },
  descriptionText: {
    fontSize: fontR(16),
    color: Colors.subtleText,
    textAlign: 'center',
    lineHeight: verticalScale(25), // Increased line height for better flow
    marginBottom: verticalScale(14), // Adjusted margin between paragraphs
    // fontFamily: 'Roboto-Regular', // Uncomment if you have this font
  },
  highlightText: {
    color: Colors.primaryGreen, // Use primary green for highlights
    fontWeight: '700', // Bold for highlights
    // fontFamily: 'Poppins-Bold', // Or 'Roboto-Bold' if preferred
  },
  boldText: { // Added for explicit bolding where Markdown might not render
    fontWeight: 'bold',
    color: Colors.darkText, // Or same as highlightText if preferred
    // fontFamily: 'Roboto-Bold',
  },
  pointsSection: {
    paddingHorizontal: moderateScale(28), // Adjusted padding
    paddingVertical: verticalScale(28), // Adjusted padding
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(20), // Margin from screen edges
    borderRadius: 25, // Even more rounded corners
    marginBottom: verticalScale(25), // Margin below this section
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 6 }, // Stronger shadow
    shadowOpacity: 0.18, // Increased opacity
    shadowRadius: 10, // Larger radius for softer shadow
    elevation: 10, // Stronger elevation (Android)
    borderLeftWidth: scale(8), // Thicker accent border
    borderLeftColor: Colors.primaryGreen,
    // iOS specific shadow for a softer, glowing look
    ...Platform.select({
      ios: {
        shadowColor: Colors.glowGreen, // Subtle glow effect on iOS
        shadowOpacity: 0.4,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 0 }, // Circular glow
      },
    }),
  },
  pointsSectionTitle: {
    fontSize: fontR(19), // Slightly larger title for this section
    fontWeight: '700', // Bold
    color: Colors.darkText,
    marginBottom: verticalScale(18), // More space below title
    textAlign: 'center',
    // fontFamily: 'Poppins-Bold', // Uncomment if you have this font
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Aligns icon and text at the top
    marginBottom: verticalScale(15), // More spacing between points
  },
  checkIcon: {
    marginRight: scale(14), // More space for icon
    marginTop: verticalScale(3), // Adjust for perfect alignment with text
  },
  pointText: {
    flex: 1, // Allows text to wrap within the available space
    fontSize: fontR(16), // Slightly larger point text
    color: Colors.darkText,
    lineHeight: verticalScale(24), // Better line height for readability
    // fontFamily: 'Roboto-Medium', // A slightly bolder font for points
  },
  bottomSection: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  bottomSectionText: {
    fontSize: fontR(16),
    fontStyle: 'italic',
    color: Colors.subtleText,
    textAlign: 'center',
    // fontFamily: 'Poppins-LightItalic', // Uncomment if you have this font
  },
});

export default LeadersCornerScreen;