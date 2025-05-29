import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WrapperContainer from '../../components/WrapperContainerComp';

import Constants, { Colors } from '../../utils/Constants';
import { moderateScale, textScale, screenWidth } from '../../utils/Scaling';
import ButtonComp from '../../components/ButtonComp';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

// Define props interface properly
type SuccessScreenProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SuccessScreen'>;
};

const SuccessScreen: React.FC<SuccessScreenProp> = ({ navigation }) => {
  return (
    <WrapperContainer>
      <View style={styles.containerView}>
        <Image style={{ marginBottom: moderateScale(16) }} source={Constants.successIc} />
        <Text style={styles.successTextStyle}>Success!</Text>
        <Text style={styles.congratulationTextStyle}>
          Congratulations! You have been successfully authenticated
        </Text>
        <View>
          <ButtonComp
            width={screenWidth / 1.2}
            buttonText={'Continue'}
            onPress={() => navigation.navigate('CreateProfileScreen')} // Wrap in function
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  containerView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
