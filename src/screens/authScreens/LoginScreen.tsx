import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef

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
import GoogleButton from '../../components/GoogleButton';
import OTPTextInput from 'react-native-otp-textinput';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const API_BASE_URL = 'http://192.168.103.188:3000';

const INITIAL_COOLDOWN = 30; // seconds
const SPAM_THRESHOLD_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const COOLDOWN_INCREMENT = 15; // seconds to add for each spam attempt

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0); // State for cooldown timer
  const [requestAttempts, setRequestAttempts] = useState(0); // Counter for spam prevention
  const lastRequestTimeRef = useRef<number>(0); // Ref to store last request timestamp

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for interval ID

  useEffect(() => {
    // Clear interval on component unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const startCountdown = (duration: number) => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setCountdown(duration);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const onRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    if (countdown > 0) {
      Alert.alert('Wait', `Please wait ${countdown} seconds before requesting another OTP.`);
      return;
    }

    setLoading(true);

    const currentTime = Date.now();
    let currentAttempts = requestAttempts;
    let currentCooldown = INITIAL_COOLDOWN;

    // Check for spam attempts
    if (currentTime - lastRequestTimeRef.current < SPAM_THRESHOLD_TIME) {
      currentAttempts += 1;
      currentCooldown = INITIAL_COOLDOWN + (currentAttempts - 1) * COOLDOWN_INCREMENT;
    } else {
      currentAttempts = 1; // Reset attempts if enough time has passed
    }

    setRequestAttempts(currentAttempts);
    lastRequestTimeRef.current = currentTime; // Update last request time

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
        setOtpSent(true);
        startCountdown(currentCooldown); // Start countdown with calculated duration
        Alert.alert('Success', data.message);
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

  const onVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Success', data.message);
        navigate('SuccessScreen');
      } else {
        Alert.alert('Error', data.message || 'OTP verification failed.');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const onPressEditEmail = () => {
    setOtpSent(false); // Go back to email input state
    setOtp(''); // Clear OTP field
    setCountdown(0); // Reset countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current); // Clear any running countdown
    }
    // Optionally, you might want to reset requestAttempts if the user goes back to edit email
    // setRequestAttempts(0);
    // lastRequestTimeRef.current = 0;
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
              editable={!otpSent}
              iconRight={otpSent ? 'pencil' : undefined} // Only show pencil icon if OTP sent
              onPressIconRight={otpSent ? onPressEditEmail : undefined} // Attach handler if icon is visible
            />

            {otpSent && (
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
                  handleTextChange={setOtp}
                  textInputProps={{ autoFocus: true }}
                />
                <TouchableOpacity onPress={() => {
                  // Option to resend OTP or go back to email input
                  setOtp('');
                  setOtpSent(false);
                  // If you want to automatically resend, uncomment the line below:
                  // onRequestOtp(); // This would trigger the cooldown logic again
                }}>
                  <Text style={styles.resendText}>Didn't receive OTP? <Text style={styles.linkText}>Resend</Text></Text>
                </TouchableOpacity>
              </View>
            )}

            <ButtonComp
              onPress={otpSent ? onVerifyOtp : onRequestOtp}
              buttonText={
                otpSent
                  ? 'Verify OTP'
                  : (countdown > 0 ? `Resend in ${countdown}s` : 'Continue') // Dynamic button text with countdown
              }
              containerStyle={styles.ButtonStyle}
              disabled={loading || (countdown > 0 && !otpSent)} // Disable button while loading or during countdown (if not OTP verification phase)
            />
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
    fontFamily: 'Roboto',
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
  otpSectionContainer: {
    marginTop: moderateScale(5),
    width: '100%',
    alignItems: 'center',
  },
  codeTextStyle: {
    fontSize: fontR(2),
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  weHaveTextstyle: {
    fontSize: fontR(8),
    color: Colors.black60 || '#666',
    fontWeight: '500',
    marginTop: moderateScale(1),
    textAlign: 'center',
    paddingHorizontal: moderateScale(10),
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
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
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
