
export type RootStackParamList = {
  Splash: undefined; // Splash screen takes no parameters
  Parent: undefined; // Parent screen takes no parameters
  Screen1:undefined;
  Screen2:undefined;
  Screen3:undefined;
};

export type RootTabParamList = {
  Screen1: undefined; // Screen1 will be a tab
  Screen2: undefined; // Screen2 will be a tab
  Screen3: undefined; // Screen3 will be a tab
  // Add any other screens you want in the Bottom Tabs here
};



export type RootDrawerParamList = {
  HomeTabNavigator: undefined; // This route will typically hold your entire BottomTabNavigator
  // You might also have other direct drawer items here:
  // ProfileDrawer: undefined;
  // SettingsDrawer: undefined;
};