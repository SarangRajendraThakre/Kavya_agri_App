import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootDrawerParamList, RootTabParamList } from '../types';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Fonts } from '../../utils/Constants';
import { storage } from '../../utils/storage';

type Screen1TabProps = BottomTabScreenProps<RootTabParamList, 'Screen1'>;

type Screen1Props = CompositeScreenProps<
  Screen1TabProps,
  DrawerScreenProps<RootDrawerParamList>
>;

const Screen1: React.FC<Screen1Props> = ({ navigation }) => {
  // Function to get all data from MMKV
  const getAllMMKVData = () => {
    const keys = storage.getAllKeys();
    const data: Record<string, any> = {};
    
    keys.forEach(key => {
      // Try to get value as different types
      data[key] = storage.getString(key) 
        || storage.getNumber(key) 
        || storage.getBoolean(key)
        || (storage.contains(key) ? 'EXISTS (UNKNOWN TYPE)' : 'MISSING');
    });
    
    return data;
  };

  const mmkvData = getAllMMKVData();

  return (
    <View style={styles.container}>
      <Text 
        style={styles.header}
        onPress={() => navigation.openDrawer()}
      >
        MMKV Storage Contents
      </Text>
      
      <ScrollView style={styles.scrollContainer}>
        {Object.entries(mmkvData).map(([key, value]) => (
          <View key={key} style={styles.itemContainer}>
            <Text style={styles.keyText}>{key}:</Text>
            <Text style={styles.valueText}>
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: Fonts.SatoshiBold,
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  itemContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  keyText: {
    fontFamily: Fonts.SatoshiBold,
    color: Colors.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  valueText: {
    fontFamily: Fonts.SatoshiRegular,
    color: Colors.text,
    fontSize: 14,
  },
});