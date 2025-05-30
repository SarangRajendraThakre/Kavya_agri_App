import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import WrapperContainer from '../../components/WrapperContainerComp';
import LottieView from 'lottie-react-native'; // Import LottieView

import Constants, { Colors } from '../../utils/Constants';
import { moderateScale, textScale, screenWidth } from '../../utils/Scaling';

import { RootStackParamList } from '../../navigation/types';
import { replace } from '../../utils/NavigationUtils';


const ProfileSuccessfulScreen: React.FC = ({  }) => {
  useEffect(() => {
    // Set a timeout to navigate after 4 seconds (4000 milliseconds)
    const timer = setTimeout(() => {
      replace('Screen1');  

    }, 2000);

    // Clear the timeout if the component unmounts before navigation
    return () => clearTimeout(timer);
  }, []);

  return (
    <WrapperContainer>
      <View style={styles.containerView}>
   
        <LottieView
          source={require('../../assets/animation/ProfileSuccessful.json')} // Adust the path to your Lottie JSON file
          autoPlay // Start playing automatically
          loop={false} // Play only once, or set to true if you want it to loop
          style={styles.lottieAnimation} // Apply styles for size and positioning
          // If your animation's natural duration is less than 4 seconds,
          // you can adjust its speed to fill the time.
          // speed={animationDurationInMs / 4000} // Example: if animation is 2s long, speed = 2000/4000 = 0.5
        />

       -
      </View>
    </WrapperContainer>
  );
};

export default ProfileSuccessfulScreen;

const styles = StyleSheet.create({
  containerView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lottieAnimation: {
    width: moderateScale(200), // Adjust size as needed
    height: moderateScale(200), // Adjust size as needed
    marginBottom: moderateScale(16), // Maintain spacing below the animation
  },
  successTextStyle: {
    fontSize: textScale(22),
    fontWeight: '600',
    color: Colors.black,
  },
  congratulationTextStyle: {
    textAlign: 'center',
    marginTop: moderateScale(8),
    color: Colors.black60,
    fontSize: textScale(18),
    fontWeight: '500',
    marginBottom: moderateScale(77),
  },
});