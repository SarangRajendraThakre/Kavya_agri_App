import { Dimensions, Platform, StatusBar } from 'react-native';

const { height, width } = Dimensions.get('window');
const guidelineBaseHeight = 812; // base height for your designs

const textScale = (size: number): number => {
  return Math.round((size * height) / guidelineBaseHeight);
};

const scale = (size: number): number => (width / 375) * size;
const verticalScale = (size: number): number => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;
const moderateScaleVertical = (size: number, factor = 0.5): number =>
  size + (verticalScale(size) - size) * factor;

// Export utilities
export {
  scale,
  verticalScale,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
};
