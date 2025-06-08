// DropdownComponent.tsx
import React from 'react'; // Import React
import { View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Ensure this is imported
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale, verticalScale, fontR } from '../utils/Scaling'; // Ensure these are correctly imported

interface Option {
  label: string;
  value: string;
}

interface DropdownComponentProps {
  data: Option[];
  placeholder: string;
  value: string | null;
  onSelect: (value: string) => void;
  icon?: string;
  searchable?: boolean;
  disabled?: boolean; // Add disabled prop
  inputContainerStyle?: ViewStyle; // Style for the outer container
  textStyle?: TextStyle; // Style for the selected text
}

// Wrap the component with React.memo
const DropdownComponent: React.FC<DropdownComponentProps> = React.memo(({
  data,
  placeholder,
  value,
  onSelect,
  icon,
  searchable = false,
  disabled = false, // Default to false
  inputContainerStyle,
  textStyle,
}) => {
  return (
    <View style={[styles.container, inputContainerStyle, disabled && styles.disabledContainer]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={moderateScale(20)}
          color="#6A5ACD"
          style={styles.icon}
        />
      )}
      <Dropdown
        style={[styles.dropdown, disabled && styles.disabledDropdown]} // Apply disabled style to dropdown
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={[styles.selectedTextStyle, textStyle, disabled && styles.disabledTextStyle]}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={searchable}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          if (!disabled) { // Only allow change if not disabled
            onSelect(item.value);
          }
        }}
        disable={disabled} // Pass disabled prop to Dropdown component
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
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
  disabledContainer: {
    backgroundColor: '#e0e0e0',
    opacity: 0.8,
  },
  icon: {
    marginRight: moderateScale(10),
  },
  dropdown: {
    flex: 1,
    height: verticalScale(45),
  },
  disabledDropdown: {
    // You might need to add specific styles here if the dropdown library doesn't handle opacity well
  },
  placeholderStyle: {
    fontSize: fontR(15),
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: fontR(15),
    color: '#333',
  },
  disabledTextStyle: {
    color: '#777', // Dim text when disabled
  },
  inputSearchStyle: {
    height: verticalScale(40),
    fontSize: fontR(15),
    borderRadius: 5, // Match border radius of inputs
  },
  iconStyle: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
});

export default DropdownComponent;