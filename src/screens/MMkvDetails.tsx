// MMkvDetails.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { storage } from '../utils/storage'; // Your MMKV storage instance

// --- Component Definition ---
const MMkvDetails: React.FC = () => {
  const [mmkvKeys, setMmkvKeys] = useState<string[]>([]);

  // Function to refresh all MMKV keys and their values
  const refreshMmkvData = () => {
    const keys = storage.getAllKeys();
    setMmkvKeys(keys);
    console.log('MMKV data refreshed. Keys:', keys);
  };

  // Fetch all MMKV data on component mount
  useEffect(() => {
    refreshMmkvData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All MMKV Stored Data</Text>

      {mmkvKeys.length > 0 ? (
        mmkvKeys.map(key => {
          let valueToDisplay: string = 'N/A';
          let type = 'Unknown';

          if (storage.contains(key)) {
            // Try to get as string first
            const stringVal = storage.getString(key);
            if (stringVal !== undefined) {
              type = 'String';
              try {
                // Attempt to parse as JSON for better display of objects/arrays
                const parsed = JSON.parse(stringVal);
                valueToDisplay = JSON.stringify(parsed, null, 2);
                type = 'JSON String';
              } catch (e) {
                // Not JSON, keep original stringVal
                valueToDisplay = stringVal;
              }
            } else {
              // If not a string, check if it's a boolean
              const boolVal = storage.getBoolean(key);
              if (typeof boolVal === 'boolean') {
                valueToDisplay = String(boolVal);
                type = 'Boolean';
              } else {
                // If not boolean, check if it's a number
                const numVal = storage.getNumber(key);
                if (typeof numVal === 'number') {
                  valueToDisplay = String(numVal);
                  type = 'Number';
                }
              }
            }
          }

          return (
            <View key={key} style={styles.mmkvItem}>
              <Text style={styles.dataLabel}>Key: **{key}**</Text>
              <Text style={styles.mmkvType}>Type: {type}</Text>
              <Text style={styles.mmkvValue}>Value: {valueToDisplay}</Text>
            </View>
          );
        })
      ) : (
        <Text style={styles.noDataText}>No data found in MMKV.</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Refresh MMKV Data" onPress={refreshMmkvData} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Clear All MMKV Data"
          color="red"
          onPress={() => {
            Alert.alert(
              'Confirm Clear',
              'Are you sure you want to clear ALL data from MMKV?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Clear All',
                  onPress: () => {
                    storage.clearAll();
                    refreshMmkvData(); // Refresh the display after clearing
                    console.log('All MMKV data cleared.');
                    Alert.alert('MMKV Cleared', 'All stored data has been removed.');
                  },
                },
              ],
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
    textAlign: 'center',
  },
  mmkvItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mmkvType: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#777',
    marginBottom: 5,
  },
  mmkvValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#666',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden', // Ensures button background adheres to border radius
  },
});

export default MMkvDetails;