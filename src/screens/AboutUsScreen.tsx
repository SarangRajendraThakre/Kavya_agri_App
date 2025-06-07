import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  // StatusBar, // Not directly used in this component, removing for clarity
} from 'react-native';

// --- START: Your Scaling Utilities (Copied directly from your input) ---
import {RFValue} from 'react-native-responsive-fontsize';
import {Dimensions} from 'react-native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export const screenWidth: number = windowWidth;
export const screenHeight: number = windowHeight;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const fontR = (fontSize: number): number => {
  return Platform.OS === 'android' ? RFValue(fontSize + 2) : RFValue(fontSize);
};

export const scale = (size: number): number =>
  (windowWidth / guidelineBaseWidth) * size;

export const verticalScale = (size: number): number =>
  (windowHeight / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

export const moderateScaleVertical = (size: number, factor = 0.5): number =>
  size + (verticalScale(size) - size) * factor;

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
            That's why we built{' '}
            <Text style={styles.boldText}>Kavya Agri Innovation</Text> – Our
            programs are designed to streamline your path to meaningful
            employment and foster sustainable career growth within the vital
            agriculture industry.
          </Text>
        </View>

        {/* --- Leaders Corner Section --- */}
        <View style={styles.leadersCornerSection}>
          <Text style={styles.leadersCornerTitle}>LEADERS CORNER</Text>
          <Text style={styles.leadersCornerSubtitle}>Meet Our Leadership Team</Text>

          <Text style={styles.leadersCornerText}>
            Our leadership team consists of{' '}
            <Text style={styles.leadersCornerHighlight}>6 seasoned professionals</Text>,
            each with over <Text style={styles.leadersCornerHighlight}>6 years of hands-on experience</Text>
            in the agriculture industry. These leaders are not just experts in
            their fields—they are passionate educators who will guide you
            throughout your learning journey.
          </Text>

          <Text style={styles.leadersCornerText}>
            Each leader specializes in a dedicated department of agriculture and
            will be conducting in-depth training sessions to give you{' '}
            <Text style={styles.leadersCornerHighlight}>
              In-Depth knowledge, industry insights, and career-ready skills.
            </Text>
          </Text>

          <View style={styles.leadersList}>
            {/* Using bullet points for emphasis */}
            <Text style={styles.leadersListItem}>
              • <Text style={styles.leadersListItemHighlight}>6+ years of industry experience</Text>
            </Text>
            <Text style={styles.leadersListItem}>
              • <Text style={styles.leadersListItemHighlight}>Experts in Agri Input, Private Banking, Organic Certification,
              agronomy, post-harvest management, horticulture, etc.</Text>
            </Text>
            <Text style={styles.leadersListItem}>
              • <Text style={styles.leadersListItemHighlight}>Proven track record of working with leading agri-companies,
              startups, and government programs</Text>
            </Text>
            <Text style={styles.leadersListItem}>
              • <Text style={styles.leadersListItemHighlight}>Strong focus on real-life case studies, field knowledge,
              and job-oriented training</Text>
            </Text>
            <Text style={styles.leadersListItem}>
              • <Text style={styles.leadersListItemHighlight}>Committed to helping you become industry-ready and confident</Text>
            </Text>
          </View>
        </View>
        {/* --- End Leaders Corner Section --- */}

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
    paddingVertical: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  headerSection: {
    marginBottom: verticalScale(40),
  },
  whoWeAreText: {
    fontSize: fontR(14),
    fontWeight: 'bold',
    color: '#A9A9A9', // Dark Gray
    marginBottom: verticalScale(10),
    letterSpacing: scale(1.5),
  },
  mainTitle: {
    fontSize: fontR(36),
    fontWeight: 'bold',
    color: '#FFFFFF', // White
    lineHeight: fontR(45),
  },
  highlightText: {
    color: '#66CDAA', // Medium Aquamarine, similar to the green highlight
  },
  contentSection: {
    marginBottom: verticalScale(30),
  },
  paragraph: {
    fontSize: fontR(16),
    lineHeight: fontR(24),
    color: '#D3D3D3', // Light Gray
    marginBottom: verticalScale(20),
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFFFFF', // White for emphasis
  },
  // --- New Styles for Leaders Corner ---
  leadersCornerSection: {
    backgroundColor: '#3C6363', // A slightly lighter/different shade of your background for contrast
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    marginBottom: verticalScale(30),
    // Optional: Add a subtle shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  leadersCornerTitle: {
    fontSize: fontR(14),
    fontWeight: 'bold',
    color: '#A9A9A9', // Dark Gray, same as 'WHO WE ARE'
    marginBottom: verticalScale(5),
    letterSpacing: scale(1.5),
  },
  leadersCornerSubtitle: {
    fontSize: fontR(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: verticalScale(15),
  },
  leadersCornerText: {
    fontSize: fontR(15),
    lineHeight: fontR(22),
    color: '#E0E0E0', // Slightly lighter than paragraph text for readability on the darker background
    marginBottom: verticalScale(10),
  },
  leadersCornerHighlight: {
    color: '#66CDAA', // Use your highlight color for key numbers/phrases
    fontWeight: 'bold',
  },
  leadersList: {
    marginTop: verticalScale(10),
  },
  leadersListItem: {
    fontSize: fontR(15),
    lineHeight: fontR(22),
    color: '#E0E0E0',
    marginBottom: verticalScale(5),
    paddingLeft: moderateScale(10), // Indent for bullet points
  },
  leadersListItemHighlight: {
    fontWeight: 'bold',
    color: '#FFFFFF', // White for extra emphasis on list items
  },
});

export default AboutUsScreen;