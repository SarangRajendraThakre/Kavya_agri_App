import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import WrapperContainer from '../../components/WrapperContainerComp';
import TextInputComp from '../../components/TextInputComp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonComp from '../../components/ButtonComp';
import Constants, { Colors } from '../../utils/Constants';
import { moderateScale, textScale } from '../../utils/Scaling';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import OtpScreen from './OtpScreen';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [emial, setEmail] = useState('');
  const [number, setNumber] = useState('');

  return (
    <WrapperContainer>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <Image style={styles.imageStyle} source={Constants.logoImage} />
        <View>
          <Text style={styles.textStyle}>OTP Verification</Text>
          <Text style={styles.enterEmailText}>
            Enter phone number to send one time Password
          </Text>
          <View style={styles.inputViewStyle}>
            <TextInputComp
              value={number}
              onChangeText={text => setNumber(text)}
              placeholder={'Phone number'}
              keyboardType={'number-pad'}
            />
            <ButtonComp
              onPress={() => navigation.navigate('OtpScreen')} // use route name as string
              buttonText={'Continue'}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
};



export default LoginScreen;

const styles = StyleSheet.create({
  imageStyle: {
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: textScale(22),
    fontWeight: '700',
    color: Colors.black,
    marginTop: moderateScale(70),
  },
  enterEmailText: {
    fontSize: textScale(18),
    color: Colors.black60,
    fontWeight: '500',
    marginTop: moderateScale(15),
  },
  inputViewStyle: {
    marginTop: moderateScale(50),
  },
});