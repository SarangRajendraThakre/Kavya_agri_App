import React from 'react';
import { View, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Define the props interface
interface CustomTextInputProps {
  icon?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  // *** DEFINE THE TYPE DIRECTLY AS THE UNION OF STRING LITERALS ***
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'; // Defined directly
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  // Corrected type for containerStyle to accept StyleSheet.AbsoluteFillObject or an array of styles
  containerStyle?: object | object[]; // Use object | object[] for flexible styling
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  pointerEvents,
  autoCapitalize,
  containerStyle // Destructure the containerStyle prop
}) => {
  return (
    // Apply the containerStyle here
    <View style={[styles.inputContainer, containerStyle]}>
      {icon && <MaterialCommunityIcons name={icon} size={20} color="#888" style={styles.icon} />}
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
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
});

export default CustomTextInput;