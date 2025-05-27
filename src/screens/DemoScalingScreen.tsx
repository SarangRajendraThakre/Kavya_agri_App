import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native'; // Import ScrollView from react-native

import WrapperContainer from '../components/WrapperContainerComp';
import ButtonComp from '../components/ButtonComp';
import Constants, { Colors } from '../utils/Constants'; // Assuming Constants and Colors are defined
import {
  scale,
  verticalScale,
  moderateScale,
  moderateScaleVertical,
  screenWidth,
  screenHeight,
  fontR,
} from '../utils/Scaling'; // Adjust path as per your project structure

// Get raw screen dimensions for comparison
const { width: rawWidth, height: rawHeight } = Dimensions.get('window');

const DemoScalingScreen: React.FC = () => {
  return (
    <WrapperContainer>
      {/* Make sure ScrollView is from 'react-native', not 'react-native-gesture-handler' if not strictly needed */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent} // Use contentContainerStyle for ScrollView children
        showsVerticalScrollIndicator={false} // Optional: Hide scroll indicator
      >
        <View style={styles.container}> {/* REMOVE flex: 1 from here */}
          {/* Header */}
          <Text style={styles.headerText}>
            Responsive Design Demo
          </Text>
          <Text style={styles.deviceInfoText}>
            Device: {rawWidth.toFixed(0)}x{rawHeight.toFixed(0)} dp
          </Text>

          {/* Example 1: Horizontal Scaling (scale) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Horizontal Scaling (scale)</Text>
            <View style={styles.boxContainer}>
              <View style={styles.scaledWidthBox} />
              <Text style={styles.boxLabel}>{`Scaled Width (100 -> ${scale(100).toFixed(1)})`}</Text>
            </View>
          </View>

          {/* Example 2: Vertical Scaling (verticalScale) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vertical Scaling (verticalScale)</Text>
            <View style={styles.boxContainer}>
              <View style={styles.scaledHeightBox} />
              <Text style={styles.boxLabel}>{`Scaled Height (50 -> ${verticalScale(50).toFixed(1)})`}</Text>
            </View>
          </View>

          {/* Example 3: Moderate Scaling (moderateScale for padding/margin) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Moderate Scaling (moderateScale)</Text>
            <View style={styles.moderateBox}>
              <Text style={styles.moderateBoxText}>
                {`Padding/Margin scaled moderately (20 -> ${moderateScale(20).toFixed(1)})`}
              </Text>
            </View>
          </View>

          {/* Example 4: Text Scaling (fontR instead of textScale) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Text Scaling (fontR)</Text>
            <Text style={styles.scaledText}>
              This text scales with `fontR(24)`!
            </Text>
            <Text style={styles.scaledSmallText}>
              Smaller text with `fontR(16)`
            </Text>
          </View>

          {/* Example 5: Image Scaling (using moderateScale for dimensions) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Image Scaling</Text>
            <Image
              source={Constants.logoImage || { uri: 'https://via.placeholder.com/100' }}
              style={styles.scaledImage}
            />
            <Text style={styles.boxLabel}>{`Image Size (100x100 -> ${moderateScale(100).toFixed(1)}x${moderateScale(100).toFixed(1)})`}</Text>
          </View>

          {/* Example 6: Button with Scaled Dimensions */}
          <ButtonComp
            onPress={() => console.log('Button Pressed')}
            buttonText="Scaled Button"
            containerStyle={styles.scaledButton}
            textStyle={styles.scaledButtonText}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    // REMOVE flex: 1 from here
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScaleVertical(30),
    alignItems: 'center',
    // You might want to remove paddingVertical from here and apply it to scrollViewContent instead
  },
  scrollViewContent: {
    // This style is applied to the content container inside the ScrollView
    flexGrow: 1, // Ensures content stretches to fill height if content is short
    alignItems: 'center', // Centers content horizontally within the scroll view
    paddingBottom: moderateScaleVertical(30), // Add padding here if needed for the bottom
    // You can also move paddingHorizontal here if it applies to the whole scrollable content
    // paddingHorizontal: moderateScale(20),
  },
  headerText: {
    fontSize: fontR(28),
    fontWeight: 'bold',
    color: Colors.black || '#333',
    marginBottom: verticalScale(10),
  },
  deviceInfoText: {
    fontSize: fontR(14),
    color: '#666', // Removed Colors.gray || because it's not defined
    marginBottom: verticalScale(20),
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(30),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: fontR(18),
    fontWeight: '600',
    marginBottom: verticalScale(10),
    color: Colors.primary || 'blue',
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  scaledWidthBox: {
    width: scale(100),
    height: verticalScale(50),
    backgroundColor: 'coral',
    borderRadius: moderateScale(5),
    marginRight: scale(10),
  },
  scaledHeightBox: {
    width: scale(50),
    height: verticalScale(50),
    backgroundColor: 'teal',
    borderRadius: moderateScale(5),
    marginRight: scale(10),
  },
  boxLabel: {
    fontSize: fontR(14),
    color: Colors.black || '#333',
  },
  moderateBox: {
    width: scale(250),
    padding: moderateScale(20),
    margin: moderateScaleVertical(15),
    backgroundColor: 'lightgreen',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  moderateBoxText: {
    fontSize: fontR(16),
    textAlign: 'center',
    color: '#555', // Removed Colors.darkGray || because it's not defined
  },
  scaledText: {
    fontSize: fontR(24),
    fontWeight: 'bold',
    color: 'navy', // Removed Colors.darkBlue || because it's not defined
    marginBottom: verticalScale(5),
  },
  scaledSmallText: {
    fontSize: fontR(16),
    color: '#666', // Removed Colors.gray || because it's not defined
  },
  scaledImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: 'contain',
    marginVertical: verticalScale(10),
  },
  scaledButton: {
    width: scale(200),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    marginTop: verticalScale(20),
    backgroundColor: Colors.primary || 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaledButtonText: {
    fontSize: fontR(18),
    color: Colors.white || 'white',
    fontWeight: 'bold',
  },
});

export default DemoScalingScreen;