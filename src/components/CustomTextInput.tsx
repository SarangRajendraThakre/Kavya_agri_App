import React from 'react';
import { View, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'; // Import AntDesign

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
  iconRightType?: 'MaterialCommunityIcons' | 'AntDesign'; // Added prop for icon type
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
  iconRightType = 'MaterialCommunityIcons' // Default to MaterialCommunityIcons if not specified
}) => {
  const renderRightIcon = () => {
    if (!iconRight) {
      return null;
    }

    switch (iconRightType) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconRight} size={20} color="#888" style={styles.iconRight} />;
      case 'AntDesign':
        return <AntDesign name={iconRight} size={20} color="#888" style={styles.iconRight} />;
      default:
        return null; // Or a default icon/error handling
    }
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
      />
      {renderRightIcon()} {/* Call the helper function to render the icon */}
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
