import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, DimensionValue } from 'react-native';

import { Colors } from '../utils/Constants';
import { moderateScale, textScale } from '../utils/Scaling'; // Assuming textScale or fontR is correctly imported and used

// It's generally better to use fontR from Scaling.ts for text sizes
// import { moderateScale, fontR } from '../utils/Scaling'; // Preferred for text

interface ButtonCompProps {
  buttonText: string;
  onPress: () => void;
  width?: DimensionValue;
  containerStyle?: ViewStyle | ViewStyle[]; // Use ViewStyle for containerStyle
  textStyle?: TextStyle | TextStyle[];     // Use TextStyle for textStyle
  disabled?: boolean; // Add the disabled prop here
}

const ButtonComp: React.FC<ButtonCompProps> = ({ buttonText, onPress, width, containerStyle, textStyle , disabled  }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btnStyle,
        width ? { width } : undefined,
        containerStyle , 
        disabled && styles.disabledBtnStyle,
      ]}
       disabled={disabled}
    >
      {/* Apply the internal default textStyle AND the external textStyle prop */}
      <Text style={[styles.textStyle, textStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComp;

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: Colors.btnColor, // Ensure Colors.btnColor exists in Constants.ts
    height: moderateScale(55),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  textStyle: {
    fontSize: textScale(18), // Or fontR(18) if you prefer accessible font scaling
    fontWeight: '600',
    color: Colors.white,
  } as TextStyle,

  disabledBtnStyle: {
    backgroundColor: Colors.lightGrey, 
    opacity: 0.7, // Make it slightly transparent
  } as ViewStyle,
});