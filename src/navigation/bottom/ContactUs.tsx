import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

const ContactUs = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // --- Configuration for contact details ---
  const WHATSAPP_NUMBER = '919307050583';
  const FACEBOOK_URL = 'https://facebook.com/641711112367020/';
  const INSTAGRAM_URL = 'https://www.instagram.com/kavya_agri?igsh=bjd1aGMzMWlmdGRp';
  const INSTAGRAM_USERNAME = 'kavya_agri';

  // --- Status Bar Management ---
  useEffect(() => {
    if (isFocused) {
      StatusBar.setBackgroundColor('#F2B1C2'); // Header color (pinkish-purple)
      StatusBar.setBarStyle('light-content'); // White text on status bar
    }

    return () => {
      if (!isFocused) {
        StatusBar.setBackgroundColor('#000000'); // Reset to black
        StatusBar.setBarStyle('light-content');
      }
    };
  }, [isFocused]);

  // Function to handle WhatsApp redirection
  const handleWhatsAppPress = async () => {
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'WhatsApp Not Installed',
          'Please install WhatsApp to contact us directly.'
        );
      }
    } catch (error) {
      console.error('An error occurred opening WhatsApp:', error);
      Alert.alert('Error', 'Could not open WhatsApp at this moment.');
    }
  };

  // Function to handle social media redirection
  const handleSocialPress = async (platform) => {
    let appUrl = '';
    let webUrl = '';

    if (platform === 'facebook') {
      appUrl = `fb://facewebmodal/f?href=${FACEBOOK_URL}`;
      webUrl = FACEBOOK_URL;
    } else if (platform === 'instagram') {
      appUrl = `instagram://user?username=${INSTAGRAM_USERNAME}`;
      webUrl = INSTAGRAM_URL;
    }

    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error(`An error occurred opening ${platform}:`, error);
      Alert.alert('Error', `Could not open ${platform} at this moment.`);
    }
  };

  return (
    <View style={styles.fullScreen}>
      {/* Solid Pink Header with Animation */}
      <SafeAreaView style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.headerIconContainer} // Use common container for consistent spacing
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header Title with Animation */}
        <Animatable.Text
          animation="fadeInDown" // Animation for the header title
          duration={800} // Faster animation
          delay={100} // Slight delay
          style={styles.headerTitle}>
          Contact Us
        </Animatable.Text>

        {/* Placeholder for right side to balance the title */}
        <View style={styles.headerIconContainer} />
      </SafeAreaView>

      {/* Main Content Area with Solid Background */}
      <View style={styles.contentContainer}>
        <Animatable.Text
          animation="fadeInDown"
          duration={1000}
          delay={200}
          style={styles.sectionTitle}>
          Get in Touch
        </Animatable.Text>

        {/* WhatsApp Section */}
        <Animatable.View
          animation="fadeInLeft"
          duration={1000}
          delay={400}
          style={styles.cardWrapper}
        >
          <TouchableOpacity style={styles.contactCard} onPress={handleWhatsAppPress}>
            <Ionicons name="logo-whatsapp" size={35} color="#25D366" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp Us</Text>
              <Text style={styles.contactValue}>{WHATSAPP_NUMBER}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999999" style={styles.arrowIcon} />
          </TouchableOpacity>
        </Animatable.View>

        {/* Social Media Section */}
        <Animatable.View
          animation="fadeInRight"
          duration={1000}
          delay={600}
          style={styles.cardWrapper}
        >
          <View style={styles.socialMediaContainer}>
            <Text style={styles.socialTitle}>Follow Us</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity onPress={() => handleSocialPress('facebook')} style={styles.socialIconWrapper}>
                <Ionicons name="logo-facebook" size={45} color="#3b5998" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSocialPress('instagram')} style={styles.socialIconWrapper}>
                <Ionicons name="logo-instagram" size={45} color="#E1306C" />
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>

        {/* Email Section */}
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={800}
          style={styles.cardWrapper}
        >
          <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('mailto:kavyaagriinnovations@outlook.com')}>
            <Ionicons name="mail-outline" size={30} color="#FFD700" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Us</Text>
              <Text style={styles.contactValue}>kavyaagriinnovations@outlook.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999999" style={styles.arrowIcon} />
          </TouchableOpacity>
        </Animatable.View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#F2B1C2', // Header background color for a seamless transition
  },
  header: {
    backgroundColor: '#F2B1C2', // Header color
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    alignItems: 'center', // Vertically center items in the row
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Distribute items with space between
    paddingHorizontal: 15, // Add horizontal padding for content
    // Added a subtle shadow to the header for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerIconContainer: {
    width: 40, // Fixed width for icons/placeholders
    height: 40, // Fixed height
    justifyContent: 'center',
    alignItems: 'center',
    // Removed absolute positioning
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    flex: 1, // Make title take up available space
    textAlign: 'center', // Center text within its flexible space
    // Removed marginRight
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F8F8F8', // Professional light gray/off-white background
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 35,
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardWrapper: {
    width: '95%',
    maxWidth: 450,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 20,
  },
  contactLabel: {
    color: '#666666',
    fontSize: 15,
    opacity: 1,
  },
  contactValue: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
  arrowIcon: {
    marginLeft: 15,
  },
  socialMediaContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 25,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
  socialTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    opacity: 1,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
  },
  socialIconWrapper: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
  },
});

export default ContactUs;