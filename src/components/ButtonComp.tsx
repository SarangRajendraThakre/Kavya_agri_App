import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, DimensionValue } from 'react-native';

import { Colors } from '../utils/Constants';
import { moderateScale, textScale } from '../utils/Scaling';

interface ButtonCompProps {
  buttonText: string;
  onPress: () => void;
  width?: DimensionValue;
}

const ButtonComp: React.FC<ButtonCompProps> = ({ buttonText, onPress, width }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btnStyle, width ? { width } : undefined]}
    >
      <Text style={styles.textStyle}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComp;

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: Colors.btnColor,
    height: moderateScale(55),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  textStyle: {
    fontSize: textScale(18),
    fontWeight: '600',
    color: Colors.white,
  } as TextStyle,
});
