// screens/ExploreScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Platform,
  UIManager,
  Animated, // Import Animated for animations
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreenProps } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient'; // Install this library
import { navigate } from '../../utils/NavigationUtils';

// Install LinearGradient:
// npm install react-native-linear-gradient
// or expo install expo-linear-gradient (for Expo)
// After installing, follow native linking instructions if not using Expo Managed Workflow.
// For bare React Native, run: npx react-native link react-native-linear-gradient

const handleExploreCourses = () => {
  navigate('CourseList'); // 'CourseList' should match the name in your RootDrawerParamList
};

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width } = Dimensions.get('window');

// --- Scaling Utility ---
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (Dimensions.get('window').height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
const fontR = (size: number) => (size * Math.min(width, Dimensions.get('window').height)) / 375 / 1.5;

// --- Color Palette ---
const Colors = {
  primaryGreen: '#4CAF50',
  secondaryBlue: '#1976D2',
  accentPurple: '#6A5ACD',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkText: '#333333',
  subtleText: '#666666',
  white: '#FFFFFF',
  gold: '#FFC107',
  buttonBg: '#6A5ACD',
  buttonText: '#FFFFFF',
  // Updated card overlay with a slight green tint for agriculture theme
  cardOverlayGradientStart: 'rgba(0, 50, 0, 0.2)', // Darker green tint, less opaque
  cardOverlayGradientEnd: 'rgba(0, 0, 0, 0.8)', // More opaque black/dark
};

// Define the type for navigation props (assuming a Stack Navigator)
type RootStackParamList = {
  Explore: undefined;
  CareerDetail: {
    key: string;
    title: string;
    fullDescription: string;
    image: any;
    icon: string;
  };
};

type ExploreScreenProps = StackScreenProps<RootStackParamList, 'Explore'>;

// Placeholder for industryData (as it was in your original code, required for cardAnimations)
const industryData = [
  // Example data, replace with your actual data if needed for cards
  // { key: '1', title: 'Agri-Business Management', fullDescription: '...', image: require('../../assets/images/agri_business.jpg'), icon: 'chart-bar' },
  // { key: '2', title: 'Sustainable Agriculture', fullDescription: '...', image: require('../../assets/images/sustainable_agri.jpg'), icon: 'leaf' },
];

const ChooseCareerScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  // Animations for hero section
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(50)).current;
  // Animations for card appearance
  const cardAnimations = useRef(industryData.map(() => new Animated.Value(0))).current;
  // Animation for CTA button pulse
  const ctaPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Hero section animation
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Card animations (staggered)
    const staggerDelay = 100;
    cardAnimations.forEach((animation, index) => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        delay: 300 + index * staggerDelay, // Staggered delay
        useNativeDriver: true,
      }).start();
    });

    // CTA button pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, { toValue: 1.05, duration: 500, useNativeDriver: true }),
        Animated.timing(ctaPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();

    return () => {
      // Clean up animations if component unmounts
      pulseLoop.stop();
    };
  }, []); // Run animations once on mount

  const navigateToCareerDetail = (career: typeof industryData[0]) => {
    navigation.navigate('CareerDetail', career);
  };

  // Array of benefits to render
  const programBenefits = [
    'Clear Career Direction',
    'Strong Industry Knowledge',
    'Building Professional Network',
    'Corporate Job Opportunities for Females',
    'Personal Career Mentorship',
    'Interview Preparation Support',
    'Professional Certification',
    'Understand Real-World Challenges and Solutions',
    'Job Opportunities from startups to MNC',
    '15+ Industry Tie-ups',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] }]}>
          <Text style={styles.heroTitle}>Unlock Your Agri Career Potential!</Text>
          <Text style={styles.heroIntro}>
            Hey Folks! Having confusion, doubt, and limited guidance about your career? Be Relax! Our program was born to answer that question with clarity, confidence, and possibility.
          </Text>
          <Text style={styles.heroTagline}>
            This program helps you find your right career direction, build strong knowledge, and take confident steps toward your future. Through live industry insights, expert mentorship, goal setting, and Interview preparation support.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleExploreCourses}>
            <Animated.Text style={[styles.ctaButtonText, { transform: [{ scale: ctaPulse }] }]}>
              Enroll Now!
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
        {/* Program Details Section */}
        <View style={styles.sectionPadded}>
          <Text style={styles.sectionTitle}>Program At a Glance</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Icon name="monitor" size={scale(36)} color={Colors.accentPurple} />
              <Text style={styles.detailItemTitle}>Mode of Training</Text>
              <Text style={styles.detailItemText}>Online</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="calendar-clock" size={scale(36)} color={Colors.accentPurple} />
              <Text style={styles.detailItemTitle}>Duration</Text>
              <Text style={styles.detailItemText}>7 Days (Approx. 1:30 hrs. per Day)</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="account-group" size={scale(36)} color={Colors.accentPurple} />
              <Text style={styles.detailItemTitle}>Seats</Text>
              <Text style={styles.detailItemText}>Limited Seats</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="text-box-outline" size={scale(36)} color={Colors.accentPurple} />
              <Text style={styles.detailItemTitle}>Exam</Text>
              <Text style={styles.detailItemText}>Included</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="certificate" size={scale(36)} color={Colors.accentPurple} />
              <Text style={styles.detailItemTitle}>Certificate</Text>
              <Text style={styles.detailItemText}>Professional Certification Provided</Text>
            </View>
          </View>
        </View>

        {/* Program Benefits Section */}
        <View style={[styles.sectionPadded, styles.lightBg]}>
          <Text style={styles.sectionTitle}>Program Benefits</Text>
          <View style={styles.benefitsGrid}>
            {programBenefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItemContainer}>
                <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} style={styles.benefitIcon} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.lightGray,
  },
  heroSection: {
    backgroundColor: Colors.primaryGreen,
    padding: moderateScale(25),
    paddingBottom: moderateScale(40),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  heroTitle: {
    fontSize: fontR(30),
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    // fontFamily: 'Poppins-Bold', // Re-add if you load custom fonts
  },
  heroIntro: {
    fontSize: fontR(16),
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    opacity: 0.9,
    lineHeight: verticalScale(24),
    // fontFamily: 'Roboto-Regular', // Re-add if you load custom fonts
  },
  heroTagline: {
    fontSize: fontR(14),
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    opacity: 0.8,
    lineHeight: verticalScale(20),
    // fontFamily: 'Roboto-Light', // Re-add if you load custom fonts
  },
  ctaButton: {
    backgroundColor: Colors.gold,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(30),
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  ctaButtonText: {
    color: Colors.darkText,
    fontSize: fontR(18),
    fontWeight: '600',
    // fontFamily: 'Poppins-SemiBold', // Re-add if you load custom fonts
  },
  sectionPadded: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(25),
  },
  lightBg: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginHorizontal: moderateScale(20),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: fontR(22),
    fontWeight: '700',
    color: Colors.darkText,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    // fontFamily: 'Poppins-Bold', // Re-add if you load custom fonts
  },
  sectionDescription: {
    fontSize: fontR(15),
    color: Colors.subtleText,
    textAlign: 'center',
    marginBottom: verticalScale(25),
    lineHeight: verticalScale(22),
    // fontFamily: 'Roboto-Regular', // Re-add if you load custom fonts
  },
  // Program Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: moderateScale(15),
    marginBottom: verticalScale(20),
  },
  detailItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: moderateScale(15),
    alignItems: 'center',
    width: width / 2 - moderateScale(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  detailItemTitle: {
    fontSize: fontR(15),
    fontWeight: '600',
    color: Colors.darkText,
    marginTop: verticalScale(8),
    textAlign: 'center',
    // fontFamily: 'Poppins-SemiBold', // Re-add if you load custom fonts
  },
  detailItemText: {
    fontSize: fontR(14),
    color: Colors.subtleText,
    textAlign: 'center',
    marginTop: verticalScale(4),
    // fontFamily: 'Roboto-Regular', // Re-add if you load customonts
  },
  // Program Benefits (Revised)
  benefitsGrid: {
    flexDirection: 'row', // Arrange items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'space-between', // Distribute items evenly with space between them
    // Removed paddingHorizontal here, let benefitItemContainer handle spacing
  },
  benefitItemContainer: {
    flexDirection: 'row', // Icon and text in a row
    alignItems: 'flex-start', // Align icon and text at the top
    width: '48%', // Each container takes roughly half the width
    marginBottom: verticalScale(12), // Spacing between rows
    paddingRight: moderateScale(5), // Small padding to prevent text from hitting edge of container
  },
  benefitIcon: {
    marginRight: moderateScale(8), // Space between icon and text
    marginTop: verticalScale(2), // Adjust vertically to align with text
  },
  benefitText: {
    flex: 1, // Allow text to take remaining space and wrap
    fontSize: fontR(16),
    color: Colors.darkText,
    lineHeight: verticalScale(24),
    // fontFamily: 'Roboto-Medium', // Re-add if you load custom fonts
  },
  // Career Cards (Updated for ImageBackground) - (No changes to these for this specific request)
  careerCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: moderateScale(15),
  },
  careerCardTouchable: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    height: verticalScale(180),
  },
  careerCardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
  careerCardBackgroundImage: {
    borderRadius: 15,
  },
  careerCardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: moderateScale(12),
  },
  careerCardTitle: {
    fontSize: fontR(18),
    fontWeight: '700',
    color: Colors.white,
    marginBottom: verticalScale(4),
  },
  careerCardDescription: {
    fontSize: fontR(12),
    color: Colors.white,
    marginBottom: verticalScale(8),
    lineHeight: verticalScale(16),
    opacity: 0.9,
  },
  learnMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(5),
  },
  learnMoreText: {
    fontSize: fontR(13),
    fontWeight: '600',
    color: Colors.gold,
  },
});

// Export the component with the name 'Explore' as you defined it
export default ChooseCareerScreen;