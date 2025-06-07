// navigation/types.ts
import { CompositeScreenProps } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';

// Define the Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Define the route parameters for the CourseDetail screen
export type CourseDetailRouteParams = {
  course: Course;
};

// Define your RootStackParamList if you use a Stack Navigator
// This is typically used for defining the overall app's stack navigation.
// If your CourseDetail is nested within a Stack that is itself
// part of a Drawer, this is relevant.
export type RootStackParamList = {
  // Add all your stack screen names here.
  // Example:
  Splash: undefined;
  LoginScreen: undefined;
  HomeScreen: undefined;
  OnboardingScreen:undefined;
  Explore:undefined;
  ProfileSuccessfulScreen:undefined;

};

export type RootTabParamList= {
  Home : undefined;
  Explore:undefined;
  Share:undefined;
}

// Define your RootDrawerParamList
// This should contain all screens directly accessible from the Drawer Navigator.
export type RootDrawerParamList = {
  Main: undefined;
  AboutUsScreen: undefined;
  CourseList: undefined;
  CourseDetail: CourseDetailRouteParams; // CourseDetail is a screen in the drawer
};


export type CourseDetailScreenProps = CompositeScreenProps<
  DrawerScreenProps<RootDrawerParamList, 'CourseDetail'>,
  StackScreenProps<RootStackParamList> // Keep this if CourseDetail might be part of a Stack somewhere, otherwise simplify
>;

export type CourseListScreenProps = CompositeScreenProps<
  DrawerScreenProps<RootDrawerParamList, 'CourseList'>,
  StackScreenProps<RootStackParamList>
>;