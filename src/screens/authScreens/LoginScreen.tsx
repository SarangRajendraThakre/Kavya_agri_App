import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // REMOVE THIS LINE
import { storage } from '../../utils/storage'; // IMPORT YOUR MMKV STORAGE INSTANCE

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

// --- IMPORTANT: Update this to your GraphQL endpoint ---
// Use your server's IP address and the GraphQL port (e.g., 4000)
// Ensure this IP is accessible from your device (e.g., same Wi-Fi network)
const API_GRAPHQL_ENDPOINT = 'http://192.168.103.188:3000/graphql';

// --- GraphQL Mutations ---
const REQUEST_OTP_MUTATION = `
  mutation RequestOtp($email: String!) {
    requestOtp(input: { email: $email }) {
      success
      message
      # You can add a cooldown value here if your server returns it in data
      # e.g., currentCooldown
    }
  }
`;

const VERIFY_OTP_MUTATION = `
  mutation VerifyOtpAndRegister(
    $email: String!,
    $otp: String!,

  ) {
    verifyOtpAndRegister(
      input: {
        email: $email,
        otp: $otp,
       
      }
    ) {
      success
      message
      accessToken
      refreshToken
    }
  }
`;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0); // State for cooldown timer
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for interval ID

  // States for new user registration fields (only needed if backend returns purpose: 'registration_complete')
  const [isRegisteringNewUser, setIsRegisteringNewUser] = useState(false);
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

    try {
      const response = await fetch(API_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if your requestOtp mutation requires it
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
          query: REQUEST_OTP_MUTATION,
          variables: { email },
        }),
      });

      const result = await response.json(); // Parse the GraphQL response
      console.log('Request OTP Response:', result); // Log the full response

      if (result.errors) {
        // Handle GraphQL errors (e.g., from rate limiting, email not found)
        const errorMessage = result.errors[0].message || 'Failed to request OTP.';
        Alert.alert('Error', errorMessage);

        // --- Client-side Cooldown based on Server's Response ---
        // If the error message contains cooldown info, extract and use it
        const cooldownMatch = errorMessage.match(/Please wait (\d+) seconds/);
        if (cooldownMatch && cooldownMatch[1]) {
          const serverCooldown = parseInt(cooldownMatch[1], 10);
          if (serverCooldown > 0) {
            startCountdown(serverCooldown);
          }
        }
      } else if (result.data && result.data.requestOtp) {
        // OTP request successful
        setOtpSent(true);
        Alert.alert('Success', result.data.requestOtp.message || 'OTP sent to your email.');

        // If the server returns a cooldown (e.g., in data.requestOtp.currentCooldown) use that
        // Otherwise, start a default cooldown for resend button visibility
        startCountdown(30); // Default to 30s if not specified by server
      } else {
        // Generic error if response.data.requestOtp is false or unexpected
        Alert.alert('Error', 'Failed to request OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Request OTP network error:', error);
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

    // If registering a new user, ensure password and name fields are filled
    if (isRegisteringNewUser) {
      if (!password || !firstName || !lastName) {
        Alert.alert('Error', 'Please fill in all registration details (Password, First Name, Last Name).');
        return;
      }
    }

    setLoading(true);
    try {
      const variables: any = { email, otp };

      // Conditionally add registration fields if needed
      if (isRegisteringNewUser) {
        variables.password = password;
        variables.firstName = firstName;
        variables.lastName = lastName;
      }

      const response = await fetch(API_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: VERIFY_OTP_MUTATION,
          variables: variables,
        }),
      });

      const result = await response.json(); // Parse the GraphQL response
      console.log('Verify OTP Response:', result); // Log the full response

      if (result.errors) {
        const errorMessage = result.errors[0].message || 'OTP verification failed.';
        Alert.alert('Error', errorMessage);
      } else if (result.data && result.data.verifyOtpAndRegister) {
        const { success, message, purpose, user, accessToken, refreshToken } = result.data.verifyOtpAndRegister;

        if (success) {
          Alert.alert('Success', message);
          // Reset state
          setOtpSent(false);
          setOtp('');
          setCountdown(0);
          setIsRegisteringNewUser(false);
          setPassword('');
          setFirstName('');
          setLastName('');
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }

          // Handle different purposes
          if (purpose === 'registration_complete') {
            // --- Store tokens and user data using MMKV ---
            try {
              storage.set('userEmail', user.email);
              storage.set('userId', user.userId);
              storage.set('accessToken', accessToken);
              storage.set('refreshToken', refreshToken);
              // You can stringify complex objects if needed, e.g., storage.set('userProfile', JSON.stringify(user));
              console.log('New user registration: User data and tokens saved with MMKV!');
              Alert.alert('Registration Successful!', 'Welcome to the app!');
              navigate('SuccessScreen'); // Navigate after successful registration
            } catch (storageError) {
              console.error('Failed to save data to MMKV after registration:', storageError);
              Alert.alert('Storage Error', 'Could not save user data locally after registration.');
            }
          } else if (purpose === 'otp_verified_for_existing_user') {
            // This means OTP was verified, but it's an existing user.
            // If your backend now returns tokens for login in this scenario, use them.
            if (user && accessToken && refreshToken) {
              // --- Store tokens and user data using MMKV ---
              try {
                storage.set('userEmail', user.email);
                storage.set('userId', user.userId);
                storage.set('accessToken', accessToken);
                storage.set('refreshToken', refreshToken);
                console.log('Existing user login: User data and tokens saved with MMKV!');
                Alert.alert('Login Successful!', 'Welcome back!');
                navigate('SuccessScreen'); // Navigate after successful login
              } catch (storageError) {
                console.error('Failed to save data to MMKV after login:', storageError);
                Alert.alert('Storage Error', 'Could not save user data locally after login.');
              }
            } else {
              // If tokens are not returned for existing users, you might
              // navigate them to a password reset screen or a dedicated login screen
              Alert.alert('OTP Verified', 'You can now proceed to login or reset password.');
              // Example: navigate('ResetPasswordScreen', { email: email });
            }
          } else {
            // Fallback for unexpected purpose
            Alert.alert('Success', 'OTP verified, but purpose is unknown. Please proceed.');
            navigate('SuccessScreen'); // Default navigation
          }
        } else {
          Alert.alert('Error', message || 'OTP verification failed.');
          // Set isRegisteringNewUser based on backend response, if applicable for retry scenario
          if (result.data.verifyOtpAndRegister.purpose === 'registration_required') { // Assuming your backend sends this
            setIsRegisteringNewUser(true);
          }
        }
      } else {
        Alert.alert('Error', 'OTP verification failed. Unexpected response.');
      }
    } catch (error: any) {
      console.error('Verify OTP network error:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const onPressEditEmail = () => {
    setOtpSent(false); // Go back to email input state
    setOtp(''); // Clear OTP field
    setCountdown(0); // Reset countdown
    setIsRegisteringNewUser(false); // Reset registration state
    setPassword('');
    setFirstName('');
    setLastName('');
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current); // Clear any running countdown
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
              iconRight={otpSent ? 'pencil' : undefined}
              onPressIconRight={otpSent ? onPressEditEmail : undefined}
            />

            {otpSent && (
              <View style={styles.otpSectionContainer}>
                <Text style={styles.weHaveTextstyle}>
                  We have sent the verification code to your email address <Text style={styles.emailTextHighlight}>{email}</Text>
                </Text>
                <OTPTextInput
                  containerStyle={styles.otpInputContainer}
                  textInputStyle={styles.textInputStyle}
                  inputCount={6} // Assuming 6-digit OTP, adjust if different from your backend
                  tintColor={Colors.btnColor}
                  offTintColor={Colors.offColor}
                  keyboardType="number-pad"
                  handleTextChange={setOtp}
                  // textInputProps={{ autoFocus: true }} // Consider enabling this if it improves UX for your app
                />
                <TouchableOpacity onPress={() => {
                  if (countdown === 0) {
                    onRequestOtp(); // This will re-trigger the cooldown logic on the server
                  } else {
                    Alert.alert('Wait', `Please wait ${countdown} seconds before requesting another OTP.`);
                  }
                }}>
                  <Text style={styles.resendText}>
                    Didn't receive OTP?{' '}
                    <Text style={styles.linkText}>
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
                    </Text>
                  </Text>
                </TouchableOpacity>

                {/* Conditional fields for new user registration */}
                {isRegisteringNewUser && (
                  <View style={styles.registrationFields}>
                    <CustomTextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder={'Create Password'}
                      containerStyle={styles.EmailInput}
                      secureTextEntry
                    />
                    <CustomTextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder={'First Name'}
                      containerStyle={styles.EmailInput}
                    />
                    <CustomTextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder={'Last Name'}
                      containerStyle={styles.EmailInput}
                    />
                  </View>
                )}

              </View>
            )}

            <ButtonComp
              onPress={otpSent ? onVerifyOtp : onRequestOtp}
              buttonText={
                otpSent
                  ? 'Verify OTP'
                  : (countdown > 0 ? `Continue in ${countdown}s` : 'Continue')
              }
              containerStyle={styles.ButtonStyle}
              disabled={loading || (countdown > 0 && !otpSent)} // Disable if loading or on cooldown (unless it's the verify phase)
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
    marginTop: moderateScale(10),
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
    marginRight:moderateScale(30)
  },
  codeTextStyle: {
    fontSize: fontR(2),
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
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
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
  registrationFields: {
    width: '100%',
    marginTop: moderateScale(20),
  },
});