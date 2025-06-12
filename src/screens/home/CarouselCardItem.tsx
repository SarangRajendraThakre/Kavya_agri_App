// src/components/CarouselCardItem.tsx
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { fontR, moderateScale, scale, verticalScale } from '../../utils/Scaling';
import { CarouselItem } from './CarouselHomeMain';

interface CarouselCardItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  // Change the prop name to reflect it's for the button, or keep onPress
  // and just use it differently. Let's keep `onPress` but specify its use.
  onPressExplore: (item: CarouselItem) => void; // New prop for button click
}

const CarouselCardItem: React.FC<CarouselCardItemProps> = ({ item, index, itemWidth, onPressExplore }) => {
  return (
    <View // Changed from TouchableOpacity to View for the main card wrapper
      style={[styles.container, { width: itemWidth }]}
    >
      <ImageBackground
        source={item.illustration}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <View style={styles.leftContentContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onPressExplore(item)} // ONLY this button triggers the navigation
              activeOpacity={0.7} // Add activeOpacity for button feedback
            >
              <Text style={styles.buttonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View> // Changed from TouchableOpacity to View
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(4.65),
    elevation: 8,
    marginVertical: verticalScale(10),
    marginHorizontal: scale(7.5),
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: verticalScale(250),
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
    borderRadius: moderateScale(10),
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    borderRadius: moderateScale(10),
    justifyContent: 'flex-end',
    padding: moderateScale(20),
  },
  leftContentContainer: {
    width: '70%',
  },
  title: {
    color: 'white',
    fontSize: fontR(15),
    fontWeight: 'bold',
    marginBottom: verticalScale(5),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: moderateScale(10),
  },
  body: {
    color: 'white',
    fontSize: fontR(8),
    marginBottom: verticalScale(15),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: moderateScale(10),
  },
  button: {
    backgroundColor: '#FFDA63',
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(25),
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#774936',
    fontWeight: 'bold',
    fontSize: fontR(10),
  },
});

export default CarouselCardItem;