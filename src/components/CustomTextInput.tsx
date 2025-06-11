// CustomTextInput.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextStyle, ViewStyle, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale, verticalScale, fontR } from '../utils/Scaling';

interface CustomTextInputProps {
  iconLeft?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  maxLength?: number;
  editable?: boolean;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  pointerEvents?: 'none' | 'auto';
  iconRight?: string;
  onPressIconRight?: () => void; // Added onPressIconRight prop
}

const CustomTextInput: React.FC<CustomTextInputProps> = React.memo(({
  iconLeft,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  editable = true,
  inputStyle,
  containerStyle,
  autoCapitalize = 'sentences',
  pointerEvents,
  iconRight,
  onPressIconRight // Destructure onPressIconRight
}) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {iconLeft && (
        <MaterialCommunityIcons
          name={iconLeft}
          size={moderateScale(20)}
          color="#6A5ACD"
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, inputStyle, !editable && styles.disabledInputText]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        autoCapitalize={autoCapitalize}
        pointerEvents={pointerEvents}
      />
      {iconRight && ( // Conditionally render iconRight
        <TouchableOpacity onPress={onPressIconRight} disabled={!onPressIconRight}>
          <MaterialCommunityIcons
            name={iconRight}
            size={moderateScale(20)}
            color="#6A5ACD" // Adjust color as needed
            style={styles.iconRight} // Add a style for the right icon
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: moderateScale(10),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  icon: {
    marginRight: moderateScale(10),
  },
  input: {
    flex: 1,
    height: verticalScale(45),
    fontSize: fontR(15),
    color: '#333',
    paddingVertical: 0,
  },
  disabledInputText: {
    color: '#777',
  },
  iconRight: {
    marginLeft: moderateScale(10), // Add left margin for spacing
    color :'#777'  },
});

export default CustomTextInput;