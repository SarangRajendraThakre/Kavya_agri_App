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
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreenProps } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../utils/NavigationUtils';
import { RootDrawerParamList } from '../types';
import PaymentDetail from '../../screens/paymentScreens/PaymentDetail';

// --- MODIFIED: Import RootDrawerParamList from your types file ---
// --- END MODIFIED ---

const handleExploreCourses = () => {
  navigate('CourseList');
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width } = Dimensions.get('window');

const scale = (size: number) => width / 375 * size;
const verticalScale = (size: number) => (Dimensions.get('window').height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
const fontR = (size: number) => size * Math.min(width, Dimensions.get('window').height) / 375 / 1.5;

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
  cardOverlayGradientStart: 'rgba(0, 50, 0, 0.2)',
  cardOverlayGradientEnd: 'rgba(0, 0, 0, 0.8)',
};

const industryData = [
  {
    key: 'agri-inputs',
    title: 'Agri Inputs',
    shortDescription: 'From seeds to crop protection, explore a thriving sector.',
    icon: 'sprout',
    image: require('../../assets/images/CarrierTopics/AgriInput.jpg'),
    fullDescription: `Agri Input is one of the fastest growing industries...`,
  },
  {
    key: 'private-agri-banking',
    title: 'Private Agri Banking',
    shortDescription: 'Combine agriculture with finance for rewarding careers.',
    icon: 'bank',
    image: require('../../assets/images/CarrierTopics/PrivateBanking.jpg'),
    fullDescription: `The private agri-banking industry...`,
  },
  {
    key: 'organic-certification',
    title: 'Organic Certification',
    shortDescription: 'Ensure sustainable and authentic organic practices.',
    icon: 'leaf',
    image: require('../../assets/images/CarrierTopics/OrganicCertification.jpg'),
    fullDescription: `The organic certification industry...`,
  },
  {
    key: 'agronomy',
    title: 'Agronomy',
    shortDescription: 'Impact food quality, farm productivity, and environmental sustainability.',
    icon: 'seed',
    image: require('../../assets/images/CarrierTopics/Agronomy.jpg'),
    fullDescription: `The agronomy industry...`,
  },
  {
    key: 'post-harvest-management',
    title: 'Post-Harvest Management',
    shortDescription: 'Reduce loss and add value to crops after harvesting.',
    icon: 'grain',
    image: require('../../assets/images/CarrierTopics/PostHarvest.jpg'),
    fullDescription: `The post-harvest industry...`,
  },
  {
    key: 'horticulture',
    title: 'Horticulture',
    shortDescription: 'High-value crops, innovation, and agribusiness in plant cultivation.',
    icon: 'flower',
    image: require('../../assets/images/CarrierTopics/Horticulture.jpg'),
    fullDescription: `Horticulture is a branch...`,
  },
];

// --- MODIFIED: Use RootDrawerParamList for proper typing and accept scroll param ---
// Also, add CareerDetail here as it's a target for navigation from this screen.
type ExploreScreenProps = StackScreenProps<RootDrawerParamList, 'Explore'>;
// --- END MODIFIED ---

const CareerAdda: React.FC<ExploreScreenProps> = ({ navigation, route }) => { // Destructure 'route'
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(50)).current;
  const cardAnimations = useRef(industryData.map(() => new Animated.Value(0))).current;
  const ctaPulse = useRef(new Animated.Value(1)).current;

  // --- ADDED: Refs for ScrollView and the target section ---
  const scrollViewRef = useRef<ScrollView>(null);
  const programBenefitsSectionRef = useRef<View>(null);
  // --- END ADDED ---

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
        delay: 300 + (index * staggerDelay),
        useNativeDriver: true,
      }).start();
    });

    // CTA button pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, { toValue: 1.05, duration: 500, useNativeDriver: true }),
        Animated.timing(ctaPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, []);

  // --- ADDED: Effect to handle scrolling based on route parameters ---
  useEffect(() => {
    if (route.params?.scrollToSection === 'programBenefits') {
      // Use a timeout to ensure the layout is measured after the component renders
      const scrollTimeout = setTimeout(() => {
        programBenefitsSectionRef.current?.measureLayout(
          scrollViewRef.current as any, // Cast to any to bypass strict type checking for measureLayout
          (x, y, width, height) => {
            scrollViewRef.current?.scrollTo({ y: y, animated: true });
          },
          (error) => {
            console.warn("Failed to measure layout for Program Benefits section:", error);
          }
        );
      }, 300); // Small delay to allow screen to render and layout

      // Optionally, clear the parameter after scrolling so it doesn't scroll again on re-focus
      // navigation.setParams({ scrollToSection: undefined });

      return () => clearTimeout(scrollTimeout);
    }
  }, [route.params?.scrollToSection]); // Re-run effect when scrollToSection param changes
  // --- END ADDED ---

  const navigateToCareerDetail = (career: typeof industryData[0]) => {
    // Assuming 'CareerDetail' is part of the same RootDrawerParamList or a stack accessible from here
    navigation.navigate('CareerDetail', career);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- MODIFIED: Attach scrollViewRef to your ScrollView --- */}
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
      {/* --- END MODIFIED --- */}
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] }]}>
          <Text style={styles.heroTitle}>Unlock Your Agri Career Potential!</Text>
          <Text style={styles.heroIntro}>
            Hey Folks! Having confusion, doubt, and limited guidance about your career? Be Relax! Our program was born to answer that question with clarity, confidence, and possibility.
          </Text>
          <Text style={styles.heroTagline}>
            This program helps you find your right career direction, build strong knowledge, and take confident steps toward your future. Through live industry insights, expert mentorship, goal setting, and Interview preparation support.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={()=>{navigate('PaymentDetail')}}>
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
              <Text style={styles.detailItemText}>Limited seats</Text>
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

        {/* --- MODIFIED: Program Benefits Section with ref --- */}
        <View ref={programBenefitsSectionRef} style={[styles.sectionPadded, styles.lightBg]}>
        {/* --- END MODIFIED --- */}
          <Text style={styles.sectionTitle}>Program Benefits</Text>
          <View style={styles.benefitsGrid}>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Clear Career Direction
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Strong Industry Knowledge
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Building Professional Network
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Cooperate job Opportunites for Females
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Personal Career Mentorship
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Interview Preparation Support
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Professional Certification
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Understand Real-World Challenges and Solutions
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Job Opportunities from startups to MNC
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  15+ Industry Tie-up
            </Text>

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
  },
  heroIntro: {
    fontSize: fontR(16),
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    opacity: 0.9,
    lineHeight: verticalScale(24),
  },
  heroTagline: {
    fontSize: fontR(14),
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    opacity: 0.8,
    lineHeight: verticalScale(20),
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
  },
  sectionDescription: {
    fontSize: fontR(15),
    color: Colors.subtleText,
    textAlign: 'center',
    marginBottom: verticalScale(25),
    lineHeight: verticalScale(22),
  },
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
    width: (width / 2) - moderateScale(30),
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
  },
  detailItemText: {
    fontSize: fontR(14),
    color: Colors.subtleText,
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  benefitsGrid: {
    paddingHorizontal: moderateScale(10),
  },
  benefitItem: {
    fontSize: fontR(16),
    color: Colors.darkText,
    marginBottom: verticalScale(8),
    lineHeight: verticalScale(24),
  },
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

export default CareerAdda;