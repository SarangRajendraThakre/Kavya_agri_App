// screens/CareerPathScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Or DrawerNavigationProp, etc.
import { RootStackParamList } from '../types';
import CareerCard from '../../screens/carrerAddaScreens/CareerCard';
import { Colors } from '../../utils/Constants';


// Define the navigation prop type for this screen based on your RootStackParamList
// Make sure 'CareerPathScreen' is defined in your RootStackParamList in types.ts
type CareerPathScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CareerAdda'>;

interface CareerPathScreenProps {
  // If this screen itself receives params, define them here.
  // For now, it doesn't.
}

const CareerAdda: React.FC<CareerPathScreenProps> = () => {
  const navigation = useNavigation<CareerPathScreenNavigationProp>();

  // Handlers for navigating to different screens
  const handleChooseCareer = () => {
    navigation.navigate('ChooseCareerScreen'); // Navigate to the screen for 'Choose Your Career'
  };

  const handleGoalSetting = () => {
    navigation.navigate('GoalSettingScreen'); // Navigate to the screen for 'Goal Setting'
  };

  const handleResumeBuilder = () => {
    navigation.navigate('ResumeBuilderScreen'); // Navigate to the screen for 'Resume Builder'
  };

  const handleInterviewPrep = () => {
    navigation.navigate('InterviewPrepScreen'); // Navigate to the screen for 'Interview Preparation Support'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Career Paths</Text>
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        <CareerCard
          title="Choose Your Career"
          onPress={handleChooseCareer}
          // iconName="compass-outline" // Example if you add an icon prop
        />
        <CareerCard
          title="Goal Setting"
          onPress={handleGoalSetting}
          // iconName="target-variant"
        />
        <CareerCard
          title="Resume Builder"
          onPress={handleResumeBuilder}
          // iconName="file-document-outline"
        />
        <CareerCard
          title="Interview Preparation Support"
          onPress={handleInterviewPrep}
          // iconName="account-tie-voice-outline"
        />
        {/* Add more cards here if needed */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark || '#1A1A1A', // Use your global background color
    padding: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text || '#FFFFFF', // Use your global text color
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    // fontFamily: 'YourCustomFont-Bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Distribute cards evenly
    paddingBottom: 20, // Add some padding at the bottom for scrollable content
  },
});

export default CareerAdda;