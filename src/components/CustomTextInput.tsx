import React from 'react';
import { View, TextInput, StyleSheet, KeyboardTypeOptions, TouchableOpacity } from 'react-native'; // <--- Import TouchableOpacity
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

// Define the props interface
interface CustomTextInputProps {
  iconLeft?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  containerStyle?: object | object[];
  iconRight?: string;
  iconRightType?: 'MaterialCommunityIcons' | 'AntDesign';
  onPressIconRight?: () => void; 
  onBlur?: () => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  iconLeft,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  pointerEvents,
  autoCapitalize,
  containerStyle,
  iconRight,
  onBlur,
  iconRightType = 'MaterialCommunityIcons',
  onPressIconRight // <--- NEW: Destructure the new prop here
}) => {
  const renderRightIcon = () => {
    if (!iconRight) {
      return null;
    }

    const IconComponent = iconRightType === 'AntDesign' ? AntDesign : MaterialCommunityIcons;

    return (
      // <--- NEW: Wrap the icon in TouchableOpacity
      <TouchableOpacity onPress={onPressIconRight} disabled={!onPressIconRight}>
        <IconComponent name={iconRight} size={20} color="#888" style={styles.iconRight} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {iconLeft && <MaterialCommunityIcons name={iconLeft} size={20} color="#888" style={styles.iconLeft} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#AAA"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        pointerEvents={pointerEvents}
        autoCapitalize={autoCapitalize}
        onBlur={onBlur}
      />
      {renderRightIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
});

export default CustomTextInput;