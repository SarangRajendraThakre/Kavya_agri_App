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

// Install LinearGradient:
// npm install react-native-linear-gradient
// or expo install expo-linear-gradient (for Expo)
// After installing, follow native linking instructions if not using Expo Managed Workflow.
// For bare React Native, run: npx react-native link react-native-linear-gradient


// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width } = Dimensions.get('window');

// --- Scaling Utility ---
const scale = (size: number) => width / 375 * size;
const verticalScale = (size: number) => (Dimensions.get('window').height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
const fontR = (size: number) => size * Math.min(width, Dimensions.get('window').height) / 375 / 1.5;


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
  cardOverlayGradientEnd: 'rgba(0, 0, 0, 0.8)',   // More opaque black/dark
};

// --- Industry Data (adjusted image paths for common structure) ---
const industryData = [
  {
    key: 'agri-inputs',
    title: 'Agri Inputs',
    shortDescription: 'From seeds to crop protection, explore a thriving sector.',
    icon: 'sprout',
    // ASSUMPTION: All images are in a folder like `assets/images/cards/`
    // You MUST VERIFY these paths relative to THIS `ExploreScreen.tsx` file.
    // If ExploreScreen.tsx is in `src/screens`, then `../../assets` goes to `src/assets`.
    // So, if your images are in `YourProject/assets/images/CareerTopics/`, the path would be:
    // require('../../assets/images/CareerTopics/AgriInput.jpg')
    // If your image `Career Adda.jpg` is actually the first one, ensure its path is correct.
    image: require('../../assets/images/CarrierTopics/AgriInput.jpg'), // Placeholder - use your actual image for this
    fullDescription: `Agri Input is one of the fastest growing industries in the Agriculture field. In the last few years, most companies have moved into Agri Input Business. These companies run their business through online channels and corporate offices, making Agri Input business very time-saving compared to field business. Different teams are responsible for running this business within an internal organization. Agri Input Business is dedicated to B2C & B2B Customers and is mainly categorized into 4 categories: Seed, Crop Nutrition, Crop Protection, & Hardware. People can explore their careers in various roles across multiple departments within this industry.`,
  },
  {
    key: 'private-agri-banking',
    title: 'Private Agri Banking',
    shortDescription: 'Combine agriculture with finance for rewarding careers.',
    icon: 'bank',
    image: require('../../assets/images/CarrierTopics/PrivateBanking.jpg'), // Placeholder
    fullDescription: `The private agri-banking industry plays an important role in farming by offering financial support to farmers, agribusinesses, and rural entrepreneurs. For agriculture aspirants, this industry presents diverse and rewarding career opportunities that combine agriculture with finance & Agri business.`,
  },
  {
    key: 'organic-certification',
    title: 'Organic Certification',
    shortDescription: 'Ensure sustainable and authentic organic practices.',
    icon: 'leaf',
    image: require('../../assets/images/CarrierTopics/OrganicCertification.jpg'), // Placeholder
    fullDescription: `The organic certification industry involves the inspection, verification, and certification of farms, food processors, and businesses that follow organic farming standards. These standards typically ban synthetic fertilizers, pesticides, GMOs, and antibiotics, and promote practices like crop rotation, composting, and biodiversity. For Agriculture Aspirants and professionals interested in agriculture, the organic certification sector offers unique and meaningful career opportunities, especially in: Organic Farm Inspector, Certification Executive, Organic Extension Officer, Quality Assurance Assistant, Sustainability Associate.`,
  },
  {
    key: 'agronomy',
    title: 'Agronomy',
    shortDescription: 'Impact food quality, farm productivity, and environmental sustainability.',
    icon: 'seed',
    image: require('../../assets/images/CarrierTopics/Agronomy.jpg'), // Placeholder
    fullDescription: `The agronomy industry revolves around improving farm productivity while ensuring sustainability. Key focus areas include Crop Production, Soil Health, Water Management, Weed & Pest Control, Climate-Smart Farming. Agronomy is a core discipline in agriculture. For Agriculture Aspirants, it opens the door to a variety of meaningful careers where they can directly impact farmers' productivity, food quality, and environmental sustainability.`,
  },
  {
    key: 'post-harvest-management',
    title: 'Post-Harvest Management',
    shortDescription: 'Reduce loss and add value to crops after harvesting.',
    icon: 'grain',
    image: require('../../assets/images/CarrierTopics/PostHarvest.jpg'), // Placeholder
    fullDescription: `The post-harvest industry refers to all the processes that occur after crops are harvested — to maintain quality, reduce loss, and add value before products reach the market or consumers. The post-harvest industry offers a wide variety of roles across technical, managerial, and research fields.`,
  },
  {
    key: 'horticulture',
    title: 'Horticulture',
    shortDescription: 'High-value crops, innovation, and agribusiness in plant cultivation.',
    icon: 'flower',
    image: require('../../assets/images/CarrierTopics/Horticulture.jpg'), // Placeholder
    fullDescription: `Horticulture is a branch of agriculture that focuses on the cultivation of fruits, vegetables, flowers, spices, plantation crops, and medicinal plants. It also includes landscaping, nursery management, and protected cultivation (like polyhouses and greenhouses). Horticulture offers a wide variety of career opportunities that go beyond traditional farming. It's ideal for those who are interested in high-value crops, innovation, and agribusiness.`,
  },
];

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


const Explore: React.FC<ExploreScreenProps> = ({ navigation }) => {
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
        delay: 300 + (index * staggerDelay), // Staggered delay
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
      // Clean up animations if component unmounts
      pulseLoop.stop();
    };
  }, []); // Run animations once on mount

  const navigateToCareerDetail = (career: typeof industryData[0]) => {
    navigation.navigate('CareerDetail', career);
  };

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
          <TouchableOpacity style={styles.ctaButton}>
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
              <Text style={styles.detailItemText}>Limited to 30 Participants</Text>
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
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Clear Career Direction
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Strong Industry Knowledge
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Building Professional Network
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Personal Career Mentorship
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Interview Preparation Support
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Professional Certification
            </Text>
            <Text style={styles.benefitItem}>
              <Icon name="arrow-right-circle" size={fontR(16)} color={Colors.primaryGreen} />  Understand Real-World Challenges and Solutions
            </Text>
          </View>
        </View>

        {/* Program Overview & Career Choices Section */}
        <View style={styles.sectionPadded}>
          <Text style={styles.sectionTitle}>Program Overview: One Program, Multiple Career Choices!</Text>
          <Text style={styles.sectionDescription}>
            This program introduces you to six high-potential careers in agriculture. With our expert guidance, you’ll gain the clarity and skills to choose the right path and grow with confidence.
          </Text>

          <View style={styles.careerCardsGrid}>
            {industryData.map((career, index) => (
              <Animated.View // Wrap in Animated.View for card pop-in
                key={career.key}
                style={{
                  opacity: cardAnimations[index],
                  transform: [{ scale: cardAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1], // Scale from 80% to 100%
                  }) }],
                  width: (width / 2) - moderateScale(30), // Maintain original width
                  marginBottom: moderateScale(15), // Maintain original margin
                }}
              >
                <TouchableOpacity
                  style={styles.careerCardTouchable}
                  onPress={() => navigateToCareerDetail(career)}
                  activeOpacity={0.7} // More noticeable feedback
                >
                  <ImageBackground
                    source={career.image}
                    style={styles.careerCardBackground}
                    imageStyle={styles.careerCardBackgroundImage}
                  >
                    <LinearGradient // Use LinearGradient for overlay
                      colors={[Colors.cardOverlayGradientStart, Colors.cardOverlayGradientEnd]}
                      style={styles.careerCardOverlay}
                    >
                      <Text style={styles.careerCardTitle}>{career.title}</Text>
                      <Text style={styles.careerCardDescription}>{career.shortDescription}</Text>
                      <View style={styles.learnMoreContainer}>
                        <Text style={styles.learnMoreText}>Explore Details </Text>
                        <Icon name="arrow-right" size={fontR(14)} color={Colors.gold} /> {/* Gold arrow */}
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              </Animated.View>
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
    // Add specific styles for the text component if you want to animate it directly
    // not the button's background. Animated.Text applies to Text components.
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
    // fontFamily: 'Poppins-SemiBold', // Re-add if you load custom fonts
  },
  detailItemText: {
    fontSize: fontR(14),
    color: Colors.subtleText,
    textAlign: 'center',
    marginTop: verticalScale(4),
    // fontFamily: 'Roboto-Regular', // Re-add if you load custom fonts
  },
  // Program Benefits
  benefitsGrid: {
    paddingHorizontal: moderateScale(10),
  },
  benefitItem: {
    fontSize: fontR(16),
    color: Colors.darkText,
    marginBottom: verticalScale(8),
    lineHeight: verticalScale(24),
    // fontFamily: 'Roboto-Medium', // Re-add if you load custom fonts
  },
  // Career Cards (Updated for ImageBackground)
  careerCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: moderateScale(15),
  },
  careerCardTouchable: {
    // The width/height/margin for the touchable are now handled by the Animated.View wrapper
    flex: 1, // Let the touchable fill its Animated.View parent
    borderRadius: 15,
    overflow: 'hidden',
    height: verticalScale(180), // Fixed height for cards
  },
  careerCardBackground: {
    flex: 1,
    justifyContent: 'flex-end', // Align content to the bottom
    resizeMode: 'cover',
  },
  careerCardBackgroundImage: {
    borderRadius: 15, // Apply borderRadius to the image itself
  },
  careerCardOverlay: {
    flex: 1, // Make the gradient fill the ImageBackground
    justifyContent: 'flex-end',
    padding: moderateScale(12),
  },
  careerCardTitle: {
    fontSize: fontR(18),
    fontWeight: '700',
    color: Colors.white,
    marginBottom: verticalScale(4),
    // fontFamily: 'Poppins-Bold', // Re-add if you load custom fonts
  },
  careerCardDescription: {
    fontSize: fontR(12),
    color: Colors.white,
    marginBottom: verticalScale(8),
    lineHeight: verticalScale(16),
    // fontFamily: 'Roboto-Regular', // Re-add if you load custom fonts
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
    color: Colors.gold, // Use gold for "Explore Details" to make it pop
    // fontFamily: 'Poppins-SemiBold', // Re-add if you load custom fonts
  },
});

// Export the component with the name 'Explore' as you defined it
export default Explore;