// types.ts

// 1. RootTabParamList (for BottomNavigator)
export type RootTabParamList = {
  Home: undefined;
  CareerAdda: undefined;
  ContactUs: undefined;
};

// 2. RootDrawerParamList (for DrawerNavigator)
// The 'Main' screen will render your BottomNavigator.
// We indicate that 'Main' might receive parameters, specifically for nested navigation.
// Updated types.ts (if you use the nested stack approach)
export type GalleryStackParamList = {
  EventGallery: undefined;
  ImageViewer: { uri: string };
};

export type RootDrawerParamList = {
  Main: { screen: keyof RootTabParamList; params?: any; } | undefined;
  ProfileEditScreen: undefined;
  AboutUsScreen: undefined;
  CourseList: undefined;
  CourseDetail: { course: any };
  CareerDetail: undefined;
  // --- MODIFIED: 'Explore' can now receive an optional 'scrollToSection' parameter ---
  Explore: { scrollToSection?: 'programBenefits' } | undefined;
  // --- END MODIFIED ---
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
  // This is the new entry for the nested stack
  Gallery: undefined; // The name of the Drawer.Screen that holds your GalleryStack
  // Remove EventGalleryScreen and ImageViewerScreen from here if they are only in the nested stack
  EventGalleryScreen:undefined;
  ImageViewerScreen: { uri: string };
  EventGallery:undefined;
  ImageViewer:undefined;
  PastEvents:undefined;
  ProgramBenefit:undefined;

};

// 3. RootStackParamList (for AppNavigator)
// This is your top-level stack.
// 'Parent' is likely the screen that renders your DrawerNavigator.
export type RootStackParamList = {
  Splash: undefined;
  OnboardingScreen: undefined;
  Parent: undefined; // Parent screen will render your DrawerNavigator
  PlayGame: undefined;
  CreateProfileScreen: undefined;
  LoginScreen: undefined;
  ProfileSuccessfulScreen: undefined;
  OtpScreen: undefined;
  SuccessScreen: undefined;
};