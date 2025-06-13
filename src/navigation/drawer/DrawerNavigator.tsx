// DrawerNavigator.tsx
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import {RootDrawerParamList} from '../types'; // Adjust path if types.ts is elsewhere
import {Colors, Fonts} from '../../utils/Constants';
import CustomDrawer from './CustomDrawer';
import Main from './Main'; // This is likely your Tab Navigator wrapped in a stack
import AboutUsScreen from '../../screens/DrawerScreens/AboutUsScreen';
import CourseListScreen from '../../screens/paymentScreens/CourseListScreen'; // Keep if accessible from drawer
import LeadersCornerScreen from '../../screens/home/LeadersCornerScreen';
import CertificateScreen from '../../screens/DrawerScreens/CertificateScreen';
import ReferralScreen from '../../screens/DrawerScreens/ReferralScreen';
// import CourseDetailScreen from '../../screens/paymentScreens/CourseDetailScreen'; // REMOVED - belongs in RootStack
import WalletPointsScreen from '../../screens/DrawerScreens/WalletPointsScreen';
import ProfileEditScreen from '../../screens/DrawerScreens/ProfileEditScreen';
import ChooseCareerScreen from '../../screens/carrerAddaScreens/ChooseCareerScreen';
import GoalSettingScreen from '../../screens/carrerAddaScreens/GoalSettingScreen';
import ResumeBuilderScreen from '../../screens/carrerAddaScreens/ResumeBuilderScreen';
import InterviewPrepScreen from '../../screens/carrerAddaScreens/InterviewPrepScreen';
import RegistrationFormScreen from '../../screens/homePageSlider2/RegistrationFormScreen';
import MMkvDetails from '../../screens/MMkvDetails';
import CareerAdda from '../bottom/CareerAdda'; // This might be a screen or part of Main
import CareerDetailScreen from '../../components/CareerDetailScreen';
import FAQScreen from '../../screens/DrawerScreens/FAQScreen';
import PastEvents from '../../screens/home/PastEvents';
import ProgramBenefit from '../../screens/home/ProgramBenefit';
// import PaymentDetail from '../../screens/paymentScreens/PaymentDetail'; // REMOVED - belongs in RootStack
// import PaymentSuccessScreen from '../../screens/paymentScreens/PaymentSuccessScreen'; // REMOVED - belongs in RootStack

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
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
      }}>
      <Drawer.Screen
        name="Main"
        component={Main}
        options={{
          headerShown: false,
          title: 'Home',
        }}
      />

      <Drawer.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{
          headerShown: false,
          title: 'About Us',
        }}
      />

      <Drawer.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{title: 'All Courses'}}
      />

      <Drawer.Screen
        name="ProgramBenefit"
        component={ProgramBenefit}
        options={{title: 'Program Benefits'}} // Changed title for clarity
      />

      <Drawer.Screen
        name="LeadersCornerScreen"
        component={LeadersCornerScreen}
        options={{
          title: 'Leaders Corner',
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="PastEvents"
        component={PastEvents}
        options={{
          title: 'Past Events', // Changed title for clarity
          headerShown: false,
        }}
      />
      {/*
        <Drawer.Screen
          name="PaymentDetail"
          component={PaymentDetail}
          options={{
            title: 'Payment', // Appropriate title
            headerShown: false,
          }}
        />
        // REMOVED: This screen should be part of RootStackParamList
        // and navigated to from other screens in your app, appearing
        // above the drawer.
      */}

      <Drawer.Screen
        name="CertificateScreen"
        component={CertificateScreen}
        options={{
          title: 'My Certificates',
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="ReferralScreen"
        component={ReferralScreen}
        options={{
          title: 'Refer & Earn',
          headerShown: false,
        }}
      />

      {/*
        <Drawer.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={({route}) => ({
            title: route.params?.course?.title ?? 'Course Details',
            headerShown: false,
          })}
        />
        // REMOVED: This screen should be part of RootStackParamList
        // and navigated to from other screens in your app, appearing
        // above the drawer.
      */}

      <Drawer.Screen
        name="WalletPointsScreen"
        component={WalletPointsScreen}
        options={{
          title: 'My Wallet',
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
        options={{
          title: 'Edit Profile',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="CareerDetail"
        component={CareerDetailScreen}
        options={{
          title: 'Career Details',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="CareerPathScreen" // This might be a placeholder. If CareerAdda is a tab, it shouldn't be a drawer item directly.
        component={CareerAdda}
        options={{headerShown: false, title: 'Career Paths'}} // Added title
      />

      <Drawer.Screen
        name="ChooseCareerScreen"
        component={ChooseCareerScreen}
        options={{title: 'Choose Career', headerShown: false}}
      />
      {/*
        <Drawer.Screen
          name="PaymentSuccessScreen"
          component={PaymentSuccessScreen}
          options={{title: 'Payment Success', headerShown: false}} // Appropriate title
        />
        // REMOVED: This screen should be part of RootStackParamList
        // and navigated to from other screens in your app, appearing
        // above the drawer.
      */}
      <Drawer.Screen
        name="FAQScreen"
        component={FAQScreen}
        options={{title: 'FAQs', headerShown: false}}
      />
      <Drawer.Screen
        name="GoalSettingScreen"
        component={GoalSettingScreen}
        options={{title: 'Goal Setting', headerShown: false}}
      />
      <Drawer.Screen
        name="ResumeBuilderScreen"
        component={ResumeBuilderScreen}
        options={{title: 'Resume Builder', headerShown: false}}
      />
      <Drawer.Screen
        name="InterviewPrepScreen"
        component={InterviewPrepScreen}
        options={{title: 'Interview Prep', headerShown: false}}
      />
      <Drawer.Screen
        name="RegistrationFormScreen"
        component={RegistrationFormScreen}
        options={{title: 'Register', headerShown: false}}
      />
      <Drawer.Screen
        name="MMkvDetails"
        component={MMkvDetails}
        options={{title: 'KV Details', headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;