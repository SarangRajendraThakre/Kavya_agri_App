// navigation/types.ts

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Base types for data
export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

// 1. RootTabParamList (for BottomNavigator - kept for context but not directly in this payment flow)
export type RootTabParamList = {
  Home: undefined;
  CareerAdda: undefined;
  ContactUs: undefined;
};

// 2. RootDrawerParamList (for DrawerNavigator - kept for context but not directly in this payment flow)
export type RootDrawerParamList = {
  Main: { screen: keyof RootTabParamList; params?: any; } | undefined;
  ProfileEditScreen: undefined;
  AboutUsScreen: undefined;
  CareerDetail: undefined;
  Explore: { scrollToSection?: 'programBenefits' } | undefined;
  CareerPathScreen: undefined;
  ChooseCareerScreen: undefined;
  GoalSettingScreen: undefined;
  ResumeBuilderScreen: undefined;
  InterviewPrepScreen: undefined;
  CardsSliderScreen:undefined;
  RegistrationFormScreen:undefined;
  MMkvDetails:undefined;
  WalletPointsScreen:undefined;
  CertificateScreen:undefined;
  ReferralScreen:undefined;
  LeadersCornerScreen:undefined;
  // Gallery: NavigatorScreenParams<GalleryStackParamList>; // REMOVED as GalleryStackParamList is removed
  PastEvents:undefined;
  ProgramBenefit:undefined;
};


// 3. RootStackParamList (for AppNavigator - Top-level stack)
// This is where PaymentDetail, CourseDetail, and PaymentSuccess will now reside directly
export type RootStackParamList = {
  Splash: undefined;
  OnboardingScreen: undefined;
  LoginScreen: undefined;
  CreateProfileScreen: undefined;
  ProfileSuccessfulScreen: undefined;
  OtpScreen: undefined;
  SuccessScreen: undefined;
  PlayGame: undefined;
  // --- Payment Flow Screens directly in RootStack ---
  PaymentDetail: undefined; // PaymentDetail no longer receives a course, it defines it
  CourseDetail: { // This screen receives the course and prefill data
    course: Course;
    prefillEmail?: string;
    prefillContact?: string;
    prefillName?: string;
  };
  PaymentSuccess: { // This screen receives all the success details to display
    courseName: string;
    amountPaid: number; // In paisa
    paymentId: string;
    orderId: string;
    paymentDate: string; // ISO string for easier passing, or Date object
    userName: string;
    userEmail: string;
    userContact: string;
  };
  // --- END Payment Flow Screens ---
  Parent: NavigatorScreenParams<RootDrawerParamList> | undefined; // Parent renders the DrawerNavigator after this flow
};

// Optional: Type props for individual screens if you access route or navigation directly
export type PaymentDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentDetail'>;
export type CourseDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;
export type PaymentSuccessScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;