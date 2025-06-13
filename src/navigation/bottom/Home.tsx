import React, { useRef, useCallback } from 'react'; // --- MODIFIED: Added useRef, useCallback ---
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import { navigate } from '../../utils/NavigationUtils';
import CustomHeader from '../../components/CustomHeader';
import { Fonts } from '../../utils/Constants';
import CarouselHomeMain from '../../screens/home/CarouselHomeMain';

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

const staticTopImage = require('../../assets/images/homepagetop3.jpg');

interface IndustryDataItem {
  key: string;
  title: string;
  shortDescription: string;
  icon: string;
  image: any;
  fullDescription: string;
}

const industryData = [
  {
    key: 'agri-inputs',
    title: 'Agri Inputs',
    shortDescription: ' Agri advice From sowing to harvesting, explore a thriving sector.',
    icon: 'sprout',
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
   {
    key: 'seedproduction',
    title: 'Seed Production',
    shortDescription: 'High-value crops, innovation, and agribusiness in plant cultivation.',
    icon: 'flower', // Assuming 'flower' maps to an icon like FontAwesome or MaterialCommunityIcons
    image: require('../../assets/images/CarrierTopics/seedproducton.jpg'),
    fullDescription: `The Seed Production Industry is a vital part of the agricultural ecosystem. It focuses on the development, multiplication, processing, packaging, and distribution of high-quality seeds for crops. Quality seeds are the foundation of healthy and productive farming
This industry offers strong career potential for agriculture graduates, especially those with knowledge in plant breeding, agronomy, genetics, and seed technology. It combines technical knowledge, fieldwork, lab research, and agri-business skills`,
  }
];

const Home = ({ navigation }: any) => {
  // --- MODIFIED: Refs for ScrollView and target section ---
  const scrollViewRef = useRef<ScrollView>(null);
  const programOverviewSectionRef = useRef<View>(null);
  const programOverviewSectionY = useRef(0); // To store the Y position of the section
  // --- END MODIFIED ---

  const navigateToCareerDetail = (career: IndustryDataItem) => {
    navigation.navigate('CareerDetail', career);
  };

  // --- MODIFIED: Scroll function ---
  const scrollToProgramOverviewSection = useCallback(() => {
    // This uses measureLayout to get the position relative to the scroll view
    // It's generally more reliable than onLayout if content shifts, but
    // onLayout can provide an initial static position. Using both for robustness.
    programOverviewSectionRef.current?.measureLayout(
      scrollViewRef.current as any, // Cast to any to bypass strict type checking for measureLayout
      (x, y, width, height) => {
        // 'y' here is the offset from the top of the ScrollView
        scrollViewRef.current?.scrollTo({ y: y, animated: true });
      },
      () => {
        console.warn("Failed to measure layout for Program Overview section. Attempting scroll to pre-calculated position.");
        // Fallback if measureLayout fails (e.g., component not yet laid out)
        if (programOverviewSectionY.current !== 0) {
            scrollViewRef.current?.scrollTo({ y: programOverviewSectionY.current, animated: true });
        }
      }
    );
  }, []);
  // --- END MODIFIED ---

  const handleLeadersCorner = () => {
    navigate('LeadersCorner');
  };

  const handlePastEvents = () => {
    navigation.navigate('PastEvents');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader title={'Kavya Agri'} />
      {/* --- MODIFIED: Attach scrollViewRef --- */}
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}>
      {/* --- END MODIFIED --- */}

        {/* Static Image Card with Text */}
        <View style={styles.staticImageCard}>
          <ImageBackground
            source={staticTopImage}
            style={styles.staticImageBackground}
            resizeMode="cover"
          >
            <Text style={styles.staticImageText}>Explore the world of Agri Career</Text>
          </ImageBackground>
        </View>

        {/* --- MODIFIED: Pass the scroll function as a prop --- */}
        <CarouselHomeMain onExploreProgramOverview={scrollToProgramOverviewSection} />
        {/* --- END MODIFIED --- */}

        {/* --- Career Choices Section --- */}
        {/* --- MODIFIED: Attach ref and onLayout to capture position --- */}
        <View
          ref={programOverviewSectionRef}
          onLayout={(event) => {
              // Store the initial Y position of the section
              programOverviewSectionY.current = event.nativeEvent.layout.y;
          }}
          style={styles.sectionPadded}
        >
        {/* --- END MODIFIED --- */}
          <Text style={styles.sectionTitle}>Program Overview: One Program, Multiple Career Choices!</Text>
          <Text style={styles.sectionDescription}>
            This program introduces you to 7 high-potential careers in agriculture. With our expert guidance, you’ll gain the clarity and skills to choose the right path and grow with confidence.
          </Text>

          <View style={styles.careerCardsGrid}>
            {industryData.map((career) => (
              <TouchableOpacity
                key={career.key}
                style={styles.careerCardTouchable}
                onPress={() => navigateToCareerDetail(career)}
                activeOpacity={0.7}
              >
                <ImageBackground
                  source={career.image}
                  style={styles.careerCardBackground}
                  imageStyle={styles.careerCardBackgroundImage}
                >
                  <LinearGradient
                    colors={[Colors.cardOverlayGradientStart, Colors.cardOverlayGradientEnd]}
                    style={styles.careerCardOverlay}
                  >
                    <Text style={styles.careerCardTitle}>{career.title}</Text>
                    <Text style={styles.careerCardDescription}>{career.shortDescription}</Text>
                    <View style={styles.learnMoreContainer}>
                      <Text style={styles.learnMoreText}>Explore Details </Text>
                      <Icon name="arrow-right" size={fontR(14)} color={Colors.gold} />
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- New Buttons Section --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigate('LeadersCornerScreen')}
          >
            <Text style={styles.actionButtonText}>Leader's Corner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PastEvents')}
          >
            <Text style={styles.actionButtonText}>Past Events</Text>
          </TouchableOpacity>
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  staticImageCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: moderateScale(15),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  staticImageBackground: {
    width: '100%',
    height: verticalScale(200),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  staticImageText: {
    // fontFamily: 'Poppins-ThinItalic', // Uncomment if you have this font
    color: Colors.white,
    fontSize: fontR(18),
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: verticalScale(5),
    paddingHorizontal: moderateScale(15),
    borderRadius: 5,
    marginBottom: verticalScale(10),
  },
  sectionPadded: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(25),
  },
  sectionTitle: {
    fontSize: fontR(22),
    fontWeight: '700',
    color: Colors.darkText,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    // fontFamily: 'Poppins-Bold',
  },
  sectionDescription: {
    fontSize: fontR(18),
    color: Colors.subtleText,
    textAlign: 'center',
    marginBottom: verticalScale(25),
    lineHeight: verticalScale(22),
    // fontFamily: 'Roboto-Regular',
  },
  careerCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: moderateScale(15),
    marginBottom: verticalScale(20),
  },
  careerCardTouchable: {
    width: (width / 2) - moderateScale(30),
    borderRadius: 15,
    overflow: 'hidden',
    height: verticalScale(180),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
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
    // fontFamily: 'Poppins-Bold',
  },
  careerCardDescription: {
    fontSize: fontR(12),
    color: Colors.white,
    marginBottom: verticalScale(8),
    lineHeight: verticalScale(16),
    opacity: 0.9,
    // fontFamily: 'Roboto-Regular',
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
    // fontFamily: 'Poppins-SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(20),
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
  },
  actionButton: {
    backgroundColor: Colors.buttonBg,
    paddingVertical: verticalScale(15),
    paddingHorizontal: moderateScale(15),
    borderRadius: 12,
    flex: 1,
    marginHorizontal: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  actionButtonText: {
    color: Colors.buttonText,
    fontSize: fontR(16),
    fontWeight: '600',
    textAlign: 'center',
    // fontFamily: 'Poppins-SemiBold',
  },
});

export default Home;