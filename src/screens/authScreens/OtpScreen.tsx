import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { ReactNode } from 'react';
import WrapperContainer from '../../components/WrapperContainerComp';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OTPTextInput from 'react-native-otp-textinput';
import ButtonComp from '../../components/ButtonComp';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale, textScale } from '../../utils/Scaling';
import Constants, { Colors } from '../../utils/Constants';
import { RootStackParamList } from '../../navigation/types';



type OtpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList , 'OtpScreen'>;
interface OtpScreenProp {
    navigation : OtpScreenNavigationProp;
}

const OtpScreen:React.FC<OtpScreenProp> = ({navigation}) => {
  return (
    <WrapperContainer>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Constants.back_arrow} />
        </TouchableOpacity>
        <View style={{marginTop: moderateScale(60)}}>
          <Text style={styles.codeTextStyle}>Verification Code</Text>
          <Text style={styles.weHaveTextstyle}>
            We have sent the verification code to your email address
          </Text>
          <OTPTextInput
            containerStyle={{
              marginTop: moderateScale(48),
              marginBottom: moderateScale(56),
            }}
            textInputStyle={styles.textInputStyle}
            inputCount={4}
            tintColor={Colors.btnColor}
            offTintColor={Colors.offColor}
            keyboardType="number-pad"
          />
         <ButtonComp
  onPress={() => navigation.navigate('SuccessScreen')}
  buttonText={'Confirm'} 
/>

        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  codeTextStyle: {
    fontSize: textScale(22),
    fontWeight: '600',
    color: Colors.black,
  },
  weHaveTextstyle: {
    fontSize: textScale(16),
    color: Colors.black60,
    fontWeight: '500',
    marginTop: moderateScale(6),
  },
  textInputStyle: {
    borderWidth: 0.5,
    borderRadius: 20,
    height: moderateScale(70),
    width: moderateScale(70),
  },
});