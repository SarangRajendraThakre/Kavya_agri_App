import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';

import WrapperContainer from '../../components/WrapperContainerComp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonComp from '../../components/ButtonComp';
import Constants, { Colors } from '../../utils/Constants';
import { moderateScale, fontR, scale } from '../../utils/Scaling';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomTextInput from '../../components/CustomTextInput';
import { navigate } from '../../utils/NavigationUtils';

import { Linking } from 'react-native';
import GoogleButton from '../../components/GoogleButton'; // Assuming this component exists
import OTPTextInput from 'react-native-otp-textinput'; // Import the OTP input component

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

// Define your backend URL (replace with your actual backend server address)
// IMPORTANT: When connected to a real device, replace 'localhost' with your computer's actual IP address on your local network.
const API_BASE_URL = 'http://192.168.103.188:3000'; // Updated with user's provided IP

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // State to hold the entered OTP
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // New state to track if OTP has been sent

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const onRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true); // Start loading
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
        setOtpSent(true); // OTP successfully sent, show OTP input and change button text
        Alert.alert('Success', data.message); // Still show success message
      } else {
        Alert.alert('Error', data.message || 'Failed to request OTP.');
      }
    } catch (error: any) {
      console.error('Request OTP error:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const onVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }), // Send email and OTP
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Success', data.message);
        navigate('SuccessScreen'); // Navigate to the SuccessScreen
      } else {
        Alert.alert('Error', data.message || 'OTP verification failed.');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <WrapperContainer>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Image style={styles.imageStyle} source={Constants.logoImage} />
          <Text style={styles.textStyle}>Login In</Text>

          {/* Email Input Section - Always visible */}
          <Text style={styles.enterEmailText}>
            Enter Email ID For Verification
          </Text>
          <View style={styles.inputViewStyle}>
            <CustomTextInput
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder={'Enter Email Id'}
              containerStyle={styles.EmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!otpSent} // Make email input non-editable once OTP is sent
              iconRight='mdiSquareEditOutline'
            />

            {otpSent && ( // Conditionally render OTP input section
              <View style={styles.otpSectionContainer}>
               
                <Text style={styles.weHaveTextstyle}>
                  We have sent the verification code to your email address <Text style={styles.emailTextHighlight}>{email}</Text>
                </Text>
                <OTPTextInput
                  containerStyle={styles.otpInputContainer}
                  textInputStyle={styles.textInputStyle}
                  inputCount={4}
                  tintColor={Colors.btnColor}
                  offTintColor={Colors.offColor}
                  keyboardType="number-pad"
                  handleTextChange={setOtp} // Capture OTP input
                  textInputProps={{ autoFocus: true }} // Auto-focus OTP input
                />
                <TouchableOpacity onPress={() => {
                  // Option to resend OTP or go back to email input
                  setOtp(''); // Clear OTP field
                  setOtpSent(false); // Go back to email input state
                  // If you want to automatically resend, uncomment the line below:
                  // onRequestOtp();
                }}>
                  <Text style={styles.resendText}>Didn't receive OTP? <Text style={styles.linkText}>Resend</Text></Text>
                </TouchableOpacity>
              </View>
            )}

            <ButtonComp
              onPress={otpSent ? onVerifyOtp : onRequestOtp} // Dynamic onPress handler
              buttonText={otpSent ? 'Verify OTP' : 'Continue'} // Dynamic button text
              containerStyle={styles.ButtonStyle}
              disabled={loading} // Disable button while loading
            />
            {/* Loader */}
            {loading && <ActivityIndicator size="small" color={Colors.btnColor} style={styles.loader} />}

            <Text style={styles.termsPrivacyText}>
              By signing up, you accept our{' '}
              <Text
                style={styles.linkText}
                onPress={() => openUrl('https://example.com/terms')}
              >
                Terms and Conditions
              </Text>
              . Please read our{' '}
              <Text
                style={styles.linkText}
                onPress={() => openUrl('https://example.com/privacy')}
              >
                Privacy Notice
              </Text>
              .
            </Text>
          </View>

          {/* Separator and Google Button - Always visible */}
          <View style={styles.orSeparator}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>
          <GoogleButton />
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
  // New styles for OTP verification section
  otpSectionContainer: {
    marginTop: moderateScale(10), // Adjusted margin to appear below email input
    width: '100%',
    alignItems: 'center',
  },
  codeTextStyle: {
    fontSize: fontR(20),
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  weHaveTextstyle: {
    fontSize: fontR(14),
    color: Colors.black60 || '#666',
    fontWeight: '500',
    marginTop: moderateScale(10),
    textAlign: 'center',
    paddingHorizontal: moderateScale(20),
  },
  emailTextHighlight: {
    fontWeight: 'bold',
    color: Colors.primary || 'blue',
  },
  textInputStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: Colors.offColor || '#E0E0E0',
    fontSize: fontR(20),
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
  otpInputContainer: {
    marginTop: moderateScale(20), // Adjusted margin to be closer to email input
    marginBottom: moderateScale(20), // Adjusted margin to be closer to button
    width: '100%',
    justifyContent: 'space-evenly',
  },
  resendText: {
    fontSize: fontR(14),
    color: Colors.black60 || '#666',
    marginTop: moderateScale(10),
    textAlign: 'center',
  },
  loader: {
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
  },
});
