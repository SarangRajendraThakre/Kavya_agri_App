// DrawerNavigator.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';

// Import your screen components
import Main from './Main'; // Adjust path if needed
import CustomDrawer from './CustomDrawer'; // Adjust path if needed

// Import RootDrawerParamList from your types.ts file
import { RootDrawerParamList } from '../types'; // Adjust path if types.ts is elsewhere
import { Colors, Fonts } from '../../utils/Constants';
import CourseDetailScreen from '../../screens/paymentScreens/CourseDetailScreen';
import CourseListScreen from '../../screens/paymentScreens/CourseListScreen';
import AboutUsScreen from '../../screens/AboutUsScreen';
import ProfileEditScreen from '../../screens/ProfileEditScreen';
import CareerAdda from '../bottom/CareerAdda';
import ChooseCareerScreen from '../../screens/carrerAddaScreens/ChooseCareerScreen';
import GoalSettingScreen from '../../screens/carrerAddaScreens/GoalSettingScreen';
import ResumeBuilderScreen from '../../screens/carrerAddaScreens/ResumeBuilderScreen';
import InterviewPrepScreen from '../../screens/carrerAddaScreens/InterviewPrepScreen';
import CareerDetailScreen from '../../components/CareerDetailScreen';
import RegistrationFormScreen from '../../screens/homePageSlider2/RegistrationFormScreen';
import MMkvDetails from '../../screens/MMkvDetails';

// Create a Drawer Navigator instance, explicitly typing it with RootDrawerParamList
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      // CORRECTED: drawerContent prop type uses DrawerContentComponentProps directly
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawer {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.backgroundDark,
        },
        drawerLabelStyle: {
          fontFamily: Fonts.SatoshiRegular,
          fontSize: 16,
        },
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.inactive,
      }}
    >
      <Drawer.Screen
        name='Main'
        component={Main}
        options={{
          headerShown: false,
          title: '',
          headerStyle: {
            backgroundColor: Colors.backgroundDark,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontFamily: Fonts.SatoshiBold,
            fontSize: 20,
          }
        }}
      />

         <Drawer.Screen
        name='AboutUsScreen'
        component={AboutUsScreen}
        options={{
          headerShown: false,
          title: 'false',
          headerStyle: {
            backgroundColor: Colors.backgroundDark,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontFamily: Fonts.SatoshiBold,
            fontSize: 20,
          }
        }}
      />
        <Drawer.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{ title: 'All Courses' }}
      />
      <Drawer.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({
          title: route.params?.course?.title ?? 'Course Details',
          headerShown: false, // Ensure header is visible
        })}
      />
      <Drawer.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
        options={({ route }) => ({
          title: 'Profile Edit',
          headerShown: false, // Ensure header is visible
        })}
      />
         <Drawer.Screen
        name="CareerDetail"
        component={CareerDetailScreen}
        options={({ route }) => ({
          title: 'Profile Edit',
          headerShown: false, // Ensure header is visible
        })}
      />
         <Drawer.Screen
          name="CareerPathScreen"
          component={CareerAdda}
          options={{ headerShown: false }} // You can choose to show/hide header
        />

        {/* Add the target screens that cards will navigate to */}
        <Drawer.Screen
          name="ChooseCareerScreen"
          component={ChooseCareerScreen} // Create this component file
          options={{ title: 'Choose Career', headerShown: false }}
        />
        <Drawer.Screen
          name="GoalSettingScreen"
          component={GoalSettingScreen} // Create this component file
          options={{ title: 'Goal Setting', headerShown: false }}
        />
        <Drawer.Screen
          name="ResumeBuilderScreen"
          component={ResumeBuilderScreen} // Create this component file
          options={{ title: 'Resume Builder', headerShown: false }}
        />
        <Drawer.Screen
          name="InterviewPrepScreen"
          component={InterviewPrepScreen} // Create this component file
          options={{ title: 'Interview Prep', headerShown: false }}
        />
          <Drawer.Screen
          name="RegistrationFormScreen"
          component={RegistrationFormScreen} // Create this component file
          options={{ title: 'Interview Prep', headerShown: false }}
        />
        <Drawer.Screen
          name="MMkvDetails"
          component={MMkvDetails} // Create this component file
          options={{ title: 'Interview Prep', headerShown: false }}
        />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;