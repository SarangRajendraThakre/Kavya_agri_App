// types.ts

// 1. RootTabParamList (for BottomNavigator)
export type RootTabParamList = {
  Home: undefined;
  CareerAdda: undefined;
  Share: undefined;
};

// 2. RootDrawerParamList (for DrawerNavigator)
// The 'Main' screen will render your BottomNavigator.
// We indicate that 'Main' might receive parameters, specifically for nested navigation.
export type RootDrawerParamList = {
  Main: {
    screen: keyof RootTabParamList; // This indicates that 'Main' can receive a 'screen' param from RootTabParamList
    params?: any; // Optional: if tabs themselves take params
  } | undefined; // 'Main' can also be navigated to without any params (e.g., as the initial route)
  ProfileEditScreen: undefined;
  AboutUsScreen: undefined;
  CourseList: undefined;
  CourseDetail: { course: any }; // Example, adjust 'any' to your actual course type
  CareerDetail: undefined;
  // Add other screens directly accessible from the drawer
  Explore : undefined;

    CareerPathScreen: undefined; // This is the screen that will contain the 4 cards
  ChooseCareerScreen: undefined; // Target screen for 'Choose Your Career'
  GoalSettingScreen: undefined; // Target screen for 'Goal Setting'
  ResumeBuilderScreen: undefined; // Target screen for 'Resume Builder'
  InterviewPrepScreen: undefined;
  CardsSliderScreen:undefined;
  RegistrationFormScreen:undefined;
  MMkvDetails:undefined;

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