import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Assuming react-native-element-dropdown
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define the structure of each item in your dropdown data
interface DropdownItem {
  label: string;
  value: string;
}

// Define the props interface for DropdownComponent
interface DropdownComponentProps {
  data: DropdownItem[];
  placeholder?: string;
  value: string | null; // Value can be string or null
  onSelect: (value: string) => void;
  icon?: string; // Optional icon name
  searchable?: boolean; // New prop: boolean to control search visibility
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  data,
  placeholder,
  value,
  onSelect,
  icon,
  searchable = true, // Set a default value to true (search is on by default)
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#6A5ACD' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        // Conditionally apply the 'search' prop
        search={searchable} // Use the new 'searchable' prop here
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        // Only show searchPlaceholder if search is enabled
        searchPlaceholder={searchable ? "Search..." : undefined}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onSelect(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          icon ? <Icon style={styles.icon} color={isFocus ? '#6A5ACD' : '#888'} name={icon} size={20} /> : null
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  dropdown: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F7F7F7',
  },
  icon: {
    marginRight: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#AAA',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});