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
import Main from './Main';
import AboutUsScreen from '../../screens/DrawerScreens/AboutUsScreen';
import CourseListScreen from '../../screens/paymentScreens/CourseListScreen';
import LeadersCornerScreen from '../../screens/home/LeadersCornerScreen';
import CertificateScreen from '../../screens/DrawerScreens/CertificateScreen';
import ReferralScreen from '../../screens/DrawerScreens/ReferralScreen';
import CourseDetailScreen from '../../screens/paymentScreens/CourseDetailScreen';
import WalletPointsScreen from '../../screens/DrawerScreens/WalletPointsScreen';
import ProfileEditScreen from '../../screens/DrawerScreens/ProfileEditScreen';
import ChooseCareerScreen from '../../screens/carrerAddaScreens/ChooseCareerScreen';
import GoalSettingScreen from '../../screens/carrerAddaScreens/GoalSettingScreen';
import ResumeBuilderScreen from '../../screens/carrerAddaScreens/ResumeBuilderScreen';
import InterviewPrepScreen from '../../screens/carrerAddaScreens/InterviewPrepScreen';
import RegistrationFormScreen from '../../screens/homePageSlider2/RegistrationFormScreen';
import MMkvDetails from '../../screens/MMkvDetails';
import CareerAdda from '../bottom/CareerAdda';
import CareerDetailScreen from '../../components/CareerDetailScreen';
import FAQScreen from '../../screens/DrawerScreens/FAQScreen';
import PastEvents from '../../screens/home/PastEvents';
import ProgramBenefit from '../../screens/home/ProgramBenefit';

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
        options={{title: 'All Courses'}}
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
          title: 'Leaders Corner',
          headerShown: false,
        }}
      />

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

      <Drawer.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({route}) => ({
          title: route.params?.course?.title ?? 'Course Details',
          headerShown: false,
        })}
      />

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
        name="CareerPathScreen"
        component={CareerAdda}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="ChooseCareerScreen"
        component={ChooseCareerScreen}
        options={{title: 'Choose Career', headerShown: false}}
      />
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
