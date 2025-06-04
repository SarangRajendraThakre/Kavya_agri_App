import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { RootTabParamList, RootStackParamList } from '../types';
import { Colors, Fonts } from '../../utils/Constants'; // Assuming these paths and exports are correct
import CustomSlider from '../../components/CustomSlider';

interface ImageSliderType {
  id: number;
  title: string;
  description: string;
  image: any;
}

type Screen2TabProps = BottomTabScreenProps<RootTabParamList, 'Screen2'>;
type Screen2Props = CompositeScreenProps<
  Screen2TabProps,
  NativeStackScreenProps<RootStackParamList>
>;

const Screen2: React.FC<Screen2Props> = ({ navigation }) => {
  const mySliderItems: ImageSliderType[] = [
    {
      id: 1,
      title: 'Majestic Peaks',
      description: 'Explore the serene beauty of snow-capped mountains.',
      image: { uri: 'https://media.istockphoto.com/id/1401722160/photo/sunny-plantation-with-growing-soya.jpg?s=612x612&w=0&k=20&c=r_Y3aJ-f-4Oye0qU_TBKvqGUS1BymFHdx3ryPkyyV0w=' },
    },
    {
      id: 2,
      title: 'Urban Vibe',
      description: 'Experience the bustling energy of the city at night.',
      image: { uri: 'https://images.pexels.com/photos/4544202/pexels-photo-4544202.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200' },
    },
    {
      id: 3,
      title: 'Tranquil Waters',
      description: 'Find peace by the calm blue ocean waves.',
      image: { uri: 'https://images.pexels.com/photos/2131784/pexels-photo-2131784.jpeg?cs=srgb&dl=pexels-quang-nguyen-vinh-222549-2131784.jpg&fm=jpg' },
    },
    {
      id: 4,
      title: 'Desert Oasis',
      description: 'Discover the hidden gems within vast sandy dunes.',
      image: { uri: 'https://images.pexels.com/photos/2131784/pexels-photo-2131784.jpeg?cs=srgb&dl=pexels-quang-nguyen-vinh-222549-2131784.jpg&fm=jpg' },
    },
  ];

  return (
    // The main container for the screen
    <View style={styles.container}>
      {/* 1. CustomSlider at the very top */}
      <CustomSlider
        itemList={mySliderItems}
        imageWidthPercentage={90}
        imageHeightPercentage={100}
        // You might want to add a style prop here like style={{ marginBottom: 20 }}
        // if CustomSlider doesn't have enough bottom margin built-in.
        // Also ensure CustomSlider.tsx accepts the 'style' prop if you use it.
      />

      {/* 2. Some descriptive text below the slider */}
      <Text style={styles.sectionTitle}>Explore Categories</Text>
      <Text style={styles.descriptionText}>
        Discover new experiences tailored just for you.
      </Text>

      {/* 3. A container for small cards or buttons */}
      <View style={styles.cardsContainer}>
        {/* Example small card/button 1 */}
        <TouchableOpacity style={styles.smallCard}>
          <Text style={styles.smallCardText}>Adventure</Text>
        </TouchableOpacity>

        {/* Example small card/button 2 */}
        <TouchableOpacity style={styles.smallCard}>
          <Text style={styles.smallCardText}>Relaxation</Text>
        </TouchableOpacity>

        {/* Example small card/button 3 */}
        <TouchableOpacity style={styles.smallCard}>
          <Text style={styles.smallCardText}>City Breaks</Text>
        </TouchableOpacity>
        {/* Add more cards/buttons as needed */}
      </View>

      {/* Optional: A general button at the bottom */}
      <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Screen1')}>
        <Text style={styles.mainButtonText}>View All Options</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Screen2;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container fills the entire screen
  
    },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.backgroundDark, // Use a dark text color defined in your Constants
    marginTop: 25, // Space above this title
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.white, // A slightly muted text color
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10, // A bit of padding for readability
  },
  cardsContainer: {
    flexDirection: 'row', // Arrange cards horizontally
    flexWrap: 'wrap', // Allow cards to wrap to the next line
    justifyContent: 'space-around', // Distribute space around cards
    width: '100%', // Take full width
    marginBottom: 30, // Space below the cards container
  },
  smallCard: {
    backgroundColor: Colors.backgroundDark, // A different color for small cards
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 8, // Space between cards
    minWidth: 100, // Ensure cards aren't too small
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Basic shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  smallCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white, // Text color for cards
  },
  mainButton: {
    padding: 15,
    backgroundColor: Colors.primary, // Your primary button color
    borderRadius: 10,
    width: '80%', // Make button take up most of the width
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Space above this button
  },
  mainButtonText: {
    fontSize: 20,
    // fontFamily: Fonts.SatoshiBold, // Uncomment if you have this font defined
    color: Colors.white,
    fontWeight: 'bold',
  },
});