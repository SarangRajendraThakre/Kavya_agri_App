// navigation/types.ts

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define your Course interface based on your backend structure.
export type Course = {
  _id: string; // MongoDB ObjectId - used for linking Payments to Courses
  courseId: string; // Your custom string ID for the course (e.g., "AGRI_001") - used for Coupon application
  title: string;
  description: string;
  price: number; // This is the original price when fetched from backend
  imageUrl: string;
  category?: string; // Optional properties
  duration?: string;
  instructor?: string;
  rating?: number;
  // Add any other properties your course object has
};

// 1. RootTabParamList (for BottomNavigator - kept for context)
export type RootTabParamList = {
  Home: undefined;
  CareerAdda: undefined;
  ContactUs: undefined;
};

// 2. RootDrawerParamList (for DrawerNavigator - kept for context)
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
  PaymentDetail: { courseId: string }; // PaymentDetail now correctly expects courseId as a param
  CourseDetail: {
    course: Course; // This 'course' object's 'price' property will be the FINAL calculated price
    originalCoursePriceDisplay: number; // Pass original price for display on CourseDetail (e.g., for strikethrough)
    prefillEmail: string; // Making these non-optional as they are expected to be collected
    prefillContact: string;
    prefillName: string;
    couponCodeUsed?: string; // NEW: Pass the applied coupon code
    discountApplied?: number; // NEW: Pass the calculated discount amount
  };
  PaymentSuccess: {
    courseName: string;
    amountPaid: number; // In paisa
    paymentId: string;
    orderId: string;
    paymentDate: string; // ISO string for easier passing, or Date object
    userName: string;
    userEmail: string;
    userContact: string;
    couponCodeUsed?: string; // NEW: Display coupon code on success screen
    discountApplied?: number; // NEW: Display discount amount on success screen
  };
  // --- END Payment Flow Screens ---
  Parent: NavigatorScreenParams<RootDrawerParamList> | undefined; // Parent renders the DrawerNavigator after this flow
};

// Optional: Type props for individual screens if you access route or navigation directly
export type PaymentDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentDetail'>;
export type CourseDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;
export type PaymentSuccessScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;