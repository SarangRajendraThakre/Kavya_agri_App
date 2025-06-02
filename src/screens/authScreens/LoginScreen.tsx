import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  findNodeHandle, // Import findNodeHandle for measuring layout
  Dimensions, // Optional: for calculating screen height if needed for more complex offsets
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {storage} from '../../utils/storage'; // IMPORT YOUR MMKV STORAGE INSTANCE
import axios from 'axios'; // Import Axios

import WrapperContainer from '../../components/WrapperContainerComp';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'; // Keep this
import ButtonComp from '../../components/ButtonComp';
import Constants, {API_GRAPHQL_ENDPOINT, Colors} from '../../utils/Constants';
import {moderateScale, fontR} from '../../utils/Scaling';
import CustomTextInput from '../../components/CustomTextInput';
import {replace} from '../../utils/NavigationUtils';

import {Linking} from 'react-native';
import GoogleButton from '../../components/GoogleButton';
import OTPTextInput from 'react-native-otp-textinput'; // Assuming this is your custom component

// Import your new CustomCheckbox component
import CustomCheckbox from '../../components/CustomCheckbox';
import {REQUEST_OTP_MUTATION, VERIFY_OTP_MUTATION} from '../../utils/mutation';

// Extend the interface for OTPTextInput to include its public methods for ref
interface OTPTextInputRef {
  clear: () => void;
  setValue: (value: string, isPaste?: boolean) => void;
  // Add other methods if you plan to use them via ref
}

const LoginScreen: React.FC = ({}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Refs for scrolling functionality
  const keyboardAwareScrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const otpInputContainerRef = useRef<View>(null); // Ref for the View containing OTPTextInput

  // Ref for the OTPTextInput component to call its clear method
  const otpInputRef = useRef<OTPTextInputRef>(null);

  // States for new user registration fields, only shown if backend signals 'registration_required'
  const [isRegisteringNewUser, setIsRegisteringNewUser] = useState(false);
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // State for terms acceptance
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Effect to scroll to OTP input when it appears
  useEffect(() => {
    if (otpSent) {
      // Give React Native a moment to render the OTP section before measuring
      setTimeout(() => {
        if (otpInputContainerRef.current && keyboardAwareScrollViewRef.current) {
          otpInputContainerRef.current.measureLayout(
            findNodeHandle(keyboardAwareScrollViewRef.current) as number, // Cast to number
            (x, y, width, height) => {
              // y is the top position of the otpInputContainerRef relative to the scroll view's content
              // We want to scroll to this position, adding a small offset for better visibility
              const offset = y + 20; // 20 pixels extra padding from the top
              keyboardAwareScrollViewRef.current?.scrollToPosition(0, offset, true);
            },
            (error) => {
              console.error('Measurement failed for OTP input container:', error);
            },
          );
        }
      }, 100); // Short delay to ensure layout is complete
    }
  }, [otpSent]); // This effect runs when otpSent changes

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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && validateEmail(text.trim())) {
      setEmailError(null);
    } else if (emailError && text.trim() === '') {
      setEmailError('Email cannot be empty.');
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('Email cannot be empty.');
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError(null);
    }
  };

  const onRequestOtp = async () => {
    handleEmailBlur();

    if (emailError || !email.trim() || !validateEmail(email.trim())) {
      return;
    }

    if (!acceptTerms) {
      Alert.alert(
        'Terms and Conditions',
        'Please accept the Terms and Conditions and Privacy Notice to continue.',
      );
      return;
    }

    if (countdown > 0) {
      Alert.alert(
        'Wait',
        `Please wait ${countdown} seconds before requesting another OTP.`,
      );
      return;
    }

    setLoading(true);

    // Clear the OTP input using the component's clear method via ref
    if (otpInputRef.current) {
      otpInputRef.current.clear();
    }
    setOtp(''); // Also clear the state holding the OTP (important for verification logic)

    try {
      const response = await axios.post(
        API_GRAPHQL_ENDPOINT,
        {
          query: REQUEST_OTP_MUTATION,
          variables: {email: email.trim()},
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = response.data;
      console.log('Request OTP Response:', result);

      if (result.errors) {
        const errorMessage =
          result.errors[0].message || 'Failed to request OTP.';
        Alert.alert('Error', errorMessage);

        const cooldownMatch = errorMessage.match(/Please wait (\d+) seconds/);
        if (cooldownMatch && cooldownMatch[1]) {
          const serverCooldown = parseInt(cooldownMatch[1], 10);
          if (serverCooldown > 0) {
            startCountdown(serverCooldown);
          }
        }
      } else if (result.data && result.data.requestOtp) {
        setOtpSent(true);
        // Alert.alert(
        //   'Success',
        //   result.data.requestOtp.message || 'OTP sent to your email.',
        // );
        startCountdown(30);
      } else {
        Alert.alert('Error', 'Failed to request OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Request OTP network error:', error);
      Alert.alert(
        'Network Error',
        'Could not connect to the server. Please check your internet connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    // If backend indicated registration is required, ensure these fields are filled
    if (isRegisteringNewUser) {
      if (!password.trim() || !firstName.trim() || !lastName.trim()) {
        Alert.alert(
          'Error',
          'Please fill in all registration details (Password, First Name, Last Name).',
        );
        return;
      }
    }

    setLoading(true);
    try {
      const variables: any = {email: email.trim(), otp};

      // Only send these if the backend expects them for registration
      // if (isRegisteringNewUser) {
      //   variables.password = password.trim();
      //   variables.firstName = firstName.trim();
      //   variables.lastName = lastName.trim();
      // }

      const response = await axios.post(
        API_GRAPHQL_ENDPOINT,
        {
          query: VERIFY_OTP_MUTATION,
          variables: variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = response.data;
      console.log('Verify OTP Response from backend:', result);

      if (result.errors) {
        const errorMessage =
          result.errors[0].message || 'OTP verification failed.';
        Alert.alert('Error', errorMessage);
      } else if (result.data && result.data.verifyOtpAndRegister) {
        const {success, message, purpose, user, accessToken, refreshToken} =
          result.data.verifyOtpAndRegister;

        if (success) {
         
          setOtpSent(false);
          setOtp('');
          setCountdown(0);
          setIsRegisteringNewUser(false); // Reset this state
          setPassword(''); // Clear registration fields
          setFirstName('');
          setLastName('');
          setEmailError(null);
          setAcceptTerms(false); // Reset terms acceptance on success
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          // Clear OTP input visually on successful verification
          if (otpInputRef.current) {
            otpInputRef.current.clear();
          }

          

          if (
            purpose === 'REGISTRATION_COMPLETE' ||
            purpose === 'otp_verified_for_existing_user' ||
             purpose === 'LOGIN_SUCCESS'
          ) {
            try {

       

    // IMPORTANT: Immediately verify if the email was stored
    console.log('MMKV: userEmail after set:', storage.getString('userEmail'));
    console.log('MMKV: userId after set:', storage.getString('userId'));
    console.log('MMKV: accessToken after set:', storage.getString('accessToken'));
    console.log('MMKV: refreshToken after set:', storage.getString('refreshToken'));

              storage.set('userEmail', user.email);
              console.log( ' mmkv set stored' + user.email);
              storage.set('userId', user.id);
         
              storage.set('role', user.role);
              storage.set('accessToken', accessToken);
              storage.set('refreshToken', refreshToken);
              console.log('User data and tokens saved with MMKV!');
             
              console.log(storage.getString(accessToken));
              console.log(storage.getString(refreshToken));
              replace('SuccessScreen');
            } catch (storageError) {
              console.error('Failed to save data to MMKV:', storageError);
              Alert.alert('Storage Error', 'Could not save user data locally.');
            }
          } else if (purpose === 'registration_required') {
            setIsRegisteringNewUser(true);
            Alert.alert(
              'Registration Required',
              'Please provide additional details to complete your registration.',
            );
          } else {
              
            replace('SuccessScreen'); // Fallback in case 'purpose' is unexpected
          }
        } else {
          Alert.alert('Error', message || 'OTP verification failed.');
          // If the backend explicitly says registration is required even on failure, set the state
    
        }
      } else {
        Alert.alert('Error', 'OTP verification failed. Unexpected response.');
      }
    } catch (error: any) {
      console.error('Verify OTP network error:', error);
      Alert.alert(
        'Network Error',
        'Could not connect to the server. Please check your internet connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  const onPressEditEmail = () => {
    setOtpSent(false);
    setOtp('');
    setCountdown(0);
    setIsRegisteringNewUser(false); // Reset registration flow
    setPassword('');
    setFirstName('');
    setLastName('');
    setEmailError(null);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    // Clear the OTP input using the component's clear method via ref
    if (otpInputRef.current) {
      otpInputRef.current.clear();
    }
  };

  return (
    <WrapperContainer>
      <KeyboardAwareScrollView
        ref={keyboardAwareScrollViewRef} // Attach ref to KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={100} // Add some extra height for scrolling, often useful
        enableOnAndroid={true} // Explicitly enable for Android
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
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder={'Enter Email Id'}
              containerStyle={styles.EmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!otpSent}
              iconRight={otpSent ? 'pencil' : undefined}
              onPressIconRight={otpSent ? onPressEditEmail : undefined}
            />
            {emailError && !otpSent && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}

            {/* Terms and Conditions Checkbox - Only show if OTP not yet sent */}
            {!otpSent && (
              <CustomCheckbox
                checked={acceptTerms}
                onPress={() => setAcceptTerms(!acceptTerms)}
                label={
                  <>
                    I agree to the{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() => openUrl('https://example.com/terms')}>
                      Terms and Conditions
                    </Text>{' '}
                    and{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() => openUrl('https://example.com/privacy')}>
                      Privacy Notice
                    </Text>
                    .
                  </>
                }
              />
            )}

            {otpSent && (
              <View
                style={styles.otpSectionContainer}
                ref={otpInputContainerRef} // Attach ref to this container View
              >
                <Text style={styles.weHaveTextstyle}>
                  We have sent the verification code to your email address{' '}
                  <Text style={styles.emailTextHighlight}>{email}</Text>
                </Text>
                <OTPTextInput
                  ref={otpInputRef} // Attach ref to the OTPTextInput component
                  containerStyle={styles.otpInputContainer}
                  textInputStyle={styles.textInputStyle}
                  inputCount={5}
                  tintColor={Colors.btnColor}
                  offTintColor={Colors.offColor}
                  keyboardType="number-pad"
                  handleTextChange={setOtp} // Still capture the text into state for verification
                  // Do NOT add a 'value' prop here, as your OTPTextInput does not support it directly
                />
                <TouchableOpacity
                  onPress={() => {
                    if (countdown === 0) {
                      onRequestOtp();
                    } else {
                      Alert.alert(
                        'Wait',
                        `Please wait ${countdown} seconds before requesting another OTP.`,
                      );
                    }
                  }}>
                  <Text style={styles.resendText}>
                    Didn't receive OTP?{' '}
                    <Text style={styles.linkText}>
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
                    </Text>
                  </Text>
                </TouchableOpacity>

              
              </View>
            )}

           <ButtonComp
               onPress={otpSent ? onVerifyOtp : onRequestOtp}
               buttonText={
                 otpSent
                   ? 'Verify OTP'
                   : countdown > 0
                   ? `Continue in ${countdown}s`
                   : 'Continue'
               }
               containerStyle={styles.ButtonStyle}
               disabled={
                 loading ||
                 (countdown > 0 && !otpSent) ||
                 (emailError && !otpSent) ||
                 (!acceptTerms && !otpSent) ||
                 (otpSent &&
                   isRegisteringNewUser &&
                   (!password.trim() || !firstName.trim() || !lastName.trim())
                   // Add a console log here to see this condition's value:
                   // && console.log('DEBUG: Reg fields empty?', (!password.trim() || !firstName.trim() || !lastName.trim()))
                   ) ||
                 (otpSent && otp.length !== 5 && !isRegisteringNewUser
                   // Add a console log here to see this condition's value:
                   // && console.log('DEBUG: OTP length invalid?', otp.length !== 6, 'isRegisteringNewUser:', isRegisteringNewUser)
                   )
               }
             />
            {loading && (
              <ActivityIndicator
                size="small"
                color={Colors.btnColor}
                style={styles.loader}
              />
            )}
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
    marginTop: moderateScale(30),
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
    marginTop: moderateScale(10),
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
  },
  linkText: {
    color: Colors.primary || 'blue',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(10),
    width: '100%',
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(40),
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
    marginLeft: moderateScale(-30), // Adjust if needed for visual alignment
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
  errorText: {
    color: 'red',
    fontSize: fontR(12),
    alignSelf: 'flex-start',
    paddingLeft: moderateScale(20),
    marginTop: moderateScale(5),
    marginBottom: moderateScale(5),
    width: '100%',
  },
});