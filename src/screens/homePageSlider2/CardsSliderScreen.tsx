// screens/CardsSliderScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, FlatList, ImageSourcePropType } from 'react-native'; // Added ImageSourcePropType for clarity
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList, RootStackParamList } from '../../navigation/types';
import ActionCard from './ActionCard';
import ImageCard from './ImageCard';
import { Colors } from '../../utils/Constants';



type CardsSliderScreenNavigationProp = StackNavigationProp<RootDrawerParamList, 'CardsSliderScreen'>;

interface CardDataItem {
  id: string;
  title: string;
  type: 'image' | 'action';
  imageSource?: ImageSourcePropType; // Only for 'image' type
  // navigateTo?: keyof RootStackParamList; // Removed as image cards are no longer clickable
  buttonText?: string; // Only for 'action' type
  buttonActionScreen?: keyof RootStackParamList; // Only for 'action' type button
}

const cardData: CardDataItem[] = [
  { id: '1', title: 'Career', type: 'image', imageSource: require('../../assets/images/CareerAdda/CareerAdda.jpg') },
  { id: '2', title: 'Choose Right Path', type: 'image', imageSource: require('../../assets/images/CareerAdda/ChooseYourRightCareer.jpg') },
  { id: '3', title: 'Goal Setting', type: 'image', imageSource: require('../../assets/images/CareerAdda/GoalSetting.jpg') },
  { id: '4', title: 'Interview Preparation', type: 'image', imageSource: require('../../assets/images/CareerAdda/InterviewPreparationSupport.jpg') },
  { id: '5', title: 'Join Our Community', buttonText: 'Register Now', type: 'action', buttonActionScreen: 'RegistrationFormScreen' },
];

const CardsSliderScreen: React.FC = () => {
  const navigation = useNavigation<CardsSliderScreenNavigationProp>();

  const renderItem = ({ item }: { item: CardDataItem }) => { // Removed 'index' as it's not used
    if (item.type === 'action') {
      return (
        <ActionCard
          title={item.title}
          buttonText={item.buttonText || 'Register Now'}
          onButtonPress={() => {
            if (item.buttonActionScreen) {
              navigation.navigate(item.buttonActionScreen);
            } else {
              console.warn('Action button pressed without a defined target screen.');
            }
          }}
        />
      );
    } else {
      return (
        <ImageCard
          title={item.title}
          imageSource={item.imageSource!} // ! asserts it's not null/undefined
          // Removed onPress from here as ImageCard no longer takes it
        />
      );
    }
  };

  return (
    <View style={styles.container}>
     
      <FlatList
        data={cardData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white || '#1A1A1A',
    
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text || '#FFFFFF',
   
    marginLeft: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default CardsSliderScreen;