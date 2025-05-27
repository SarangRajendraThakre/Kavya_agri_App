import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';

import WrapperContainer from '../../components/WrapperContainerComp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonComp from '../../components/ButtonComp';
import Constants, { Colors } from '../../utils/Constants';
import { moderateScale, fontR, scale } from '../../utils/Scaling'; // Adjusted imports
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomTextInput from '../../components/CustomTextInput';
import { navigate } from '../../utils/NavigationUtils';
import GoogleIcon from '../../assets/icons/google.svg';
import { Linking } from 'react-native';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}


// Define your backend URL (replace with your actual backend server address)
const API_BASE_URL = 'http://localhost:3000'; // IMPORTANT: Use your actual IP or domain

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };



  const onRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        navigate('OtpScreen', { email }); // Pass email to OtpScreen
      } else {
        Alert.alert('Error', data.message || 'Failed to request OTP.');
      }
    } catch (error: any) {
      console.error('Request OTP error:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };
  // --- End OTP Request Logic ---

  return (
    <WrapperContainer>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Image style={styles.imageStyle} source={Constants.logoImage} />
          <Text style={styles.textStyle}>OTP Verification</Text>
          <Text style={styles.enterEmailText}>
            Enter Email ID For Verification
          </Text>
          <View style={styles.inputViewStyle}>

            <CustomTextInput
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder={'Enter Email Id'}
              containerStyle={styles.EmailInput}
            />

            <ButtonComp
              onPress={onRequestOtp} // Use the new OTP request handler
              buttonText={'Continue'}
              containerStyle={styles.ButtonStyle}
              disabled={loading} // Disable button while loading
            />

            <Text style={styles.termsPrivacyText}>
              By signing up, you accept our{' '}
              <Text
                style={styles.linkText}
                onPress={() => openUrl('https://example.com/terms')} // Replace with actual URL
              >
                Terms and Conditions
              </Text>
              . Please read our{' '}
              <Text
                style={styles.linkText}
                onPress={() => openUrl('https://example.com/privacy')} // Replace with actual URL
              >
                Privacy Notice
              </Text>
              .
            </Text>

          </View>
        </View>

        <View style={styles.orSeparator}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={onGoogleButtonPress}
            disabled={loading}
          >
            <GoogleIcon width={scale(24)} height={scale(24)} />
            <Text style={styles.socialButtonText}>
              {loading ? 'Signing in...' : 'Google'}
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: moderateScale(20),
    width: '100%',
    alignItems: 'center',
  },
  imageStyle: {
    alignSelf: 'center',
    marginTop: moderateScale(50),
    width: moderateScale(150),
    height: moderateScale(150),
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: fontR(22),
    fontWeight: '700',
    color: Colors.black,
    marginTop: moderateScale(50),
    textAlign: 'center',
  },
  enterEmailText: {
    fontSize: fontR(16),
    color: Colors.black60 || '#666',
    fontWeight: '500',
    marginTop: moderateScale(15),
    textAlign: 'center',
  },
  inputViewStyle: {
    width: '100%',
    marginTop: moderateScale(50),
    alignItems: 'center',
  },
  EmailInput: {
    marginTop: moderateScale(-30),
    width: '100%',
  },
  ButtonStyle: {
    marginTop: moderateScale(20),
    marginBottom: moderateScale(30),
    width: '100%',
  },
  termsPrivacyText: {
    fontSize: fontR(12),
    color: Colors.black || '#555',
    textAlign: 'center',
    marginTop: moderateScale(10),
    lineHeight: fontR(18),
    paddingHorizontal: moderateScale(10),
  },
  linkText: {
    color: Colors.primary || 'blue',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(30),
    width: '100%',
    paddingHorizontal: moderateScale(20),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: moderateScale(10),
    color: '#888',
    fontSize: fontR(14),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: moderateScale(30),
    paddingHorizontal: moderateScale(20),
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#DDD',
    width: '48%',
    justifyContent: 'center',
  },
  socialButtonText: {
    paddingLeft: scale(10),
    fontSize: fontR(16),
    color: '#333',
  },
});