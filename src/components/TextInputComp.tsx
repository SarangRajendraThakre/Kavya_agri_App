import React from 'react';
import {
  Image,
  ImageSourcePropType,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';


import { moderateScale, textScale } from '../utils/Scaling';
import Constants, { Colors } from '../utils/Constants';

// ✅ Define the prop types
interface TextInputCompProps {
  value: string;
  onChangeText: (text: string) => void;
  rightIcon?: boolean;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

const TextInputComp: React.FC<TextInputCompProps> = ({
  value,
  onChangeText,
  rightIcon,
  placeholder,
  keyboardType,
}) => {
  return (
    <View style={styles.viewStyle}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.textInputStyle}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />

      {rightIcon && <Image source= { Constants.Editicon  as ImageSourcePropType} />}
    </View>
  );
};

export default TextInputComp;

const styles = StyleSheet.create({
  viewStyle: {
    height: moderateScale(70),
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: Colors.black60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(18),
    marginBottom: moderateScale(50),
  } as ViewStyle,

  textInputStyle: {
    flex: 1,
    height: moderateScale(70),
    fontSize: textScale(18),
    color: Colors.black60,
  } as TextStyle,
});
