import { Dimensions, Platform, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

// Get window dimensions once and assign to clearly named local variables
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Export raw dimensions for direct use where needed (e.g., screenWidth, screenHeight)
export const screenWidth: number = windowWidth;
export const screenHeight: number = windowHeight;

// Base dimensions from your design
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Text scaling using RFValue with platform adjustment
export const fontR = (fontSize: number): number => {
  return Platform.OS === 'android' ? RFValue(fontSize + 2) : RFValue(fontSize);
};

// Horizontal scaling
export const scale = (size: number): number => (windowWidth / guidelineBaseWidth) * size;

// Vertical scaling
export const verticalScale = (size: number): number => (windowHeight / guidelineBaseHeight) * size;

// Moderate horizontal scaling
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

// Moderate vertical scaling
export const moderateScaleVertical = (size: number, factor = 0.5): number =>
  size + (verticalScale(size) - size) * factor;

// Keep textScale only if you have a specific non-RFValue use case.
// Otherwise, it's generally best to consistently use fontR for all text.
export const textScale = (size: number): number => {
  return Math.round((size * windowHeight) / guidelineBaseHeight);
};

// No need for a separate export { ... } block if you're using 'export const'
// or 'export function' directly on the declarations above.