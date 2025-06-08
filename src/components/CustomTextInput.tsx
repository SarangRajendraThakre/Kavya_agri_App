// CustomTextInput.tsx
import React from 'react'; // Import React
import { View, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale, verticalScale, fontR } from '../utils/Scaling'; // Ensure these are correctly imported

interface CustomTextInputProps {
  iconLeft?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  maxLength?: number;
  editable?: boolean; // Added editable prop
  inputStyle?: TextStyle; // Style for the TextInput itself
  containerStyle?: ViewStyle; // Style for the outer View
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  pointerEvents?: 'none' | 'auto'; // Added pointerEvents
}

// Wrap the component with React.memo
const CustomTextInput: React.FC<CustomTextInputProps> = React.memo(({
  iconLeft,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  editable = true, // Default to true
  inputStyle,
  containerStyle,
  autoCapitalize = 'sentences',
  pointerEvents,
}) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {iconLeft && (
        <MaterialCommunityIcons
          name={iconLeft}
          size={moderateScale(20)}
          color="#6A5ACD" // Adjust color as needed
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, inputStyle, !editable && styles.disabledInputText]} // Apply disabled text style
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        autoCapitalize={autoCapitalize}
        pointerEvents={pointerEvents} // Apply pointerEvents
      />
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Lighter background for input
    borderRadius: 8,
    paddingHorizontal: moderateScale(10),
    marginBottom: verticalScale(10), // Adjust spacing if needed, typically handled by parent FieldRenderer
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // Add subtle shadow for depth
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
    height: verticalScale(45), // Consistent height
    fontSize: fontR(15),
    color: '#333', // Darker text for readability
    paddingVertical: 0, // Remove default vertical padding
  },
  disabledInputText: {
    color: '#777', // Dim text when input is disabled
  },
});

export default CustomTextInput;