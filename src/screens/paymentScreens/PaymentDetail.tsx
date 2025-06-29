// screens/PaymentDetail.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { PaymentDetailScreenProps, Course } from '../../navigation/types';

import { Backend_Main } from '../../utils/Constants'; // Ensure Backend_Main is correctly defined
import axios from 'axios';

const PaymentDetail: React.FC<PaymentDetailScreenProps> = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; contact?: string }>({});

  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null); // This holds the CURRENT EFFECTIVE PRICE
  const [originalCoursePrice, setOriginalCoursePrice] = useState<number | null>(null); // This stores the price fetched from backend
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState<number | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false); // Controls visibility of coupon input

  // Get courseId from route.params - now explicitly defined in types.ts
  const courseId = "AGRI001";

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        console.warn('PaymentDetail: No course ID provided to fetch details. This should not happen if types are followed.');
        setFetchError('Course ID is missing. Please select a course again.');
        setLoadingCourse(false);
        return;
      }

      setLoadingCourse(true);
      setFetchError(null); // Clear any previous errors

      try {
        console.log(`PaymentDetail: Fetching course details for ID: ${courseId} from ${Backend_Main}/api/courses/${courseId}`);
        const response = await axios.get<Course>(`${Backend_Main}/api/courses/${courseId}`);
        console.log('PaymentDetail: Course fetch successful, data:', response.data);

        // Ensure the fetched data has a 'price' property and the required IDs
        if (response.data && typeof response.data.price === 'number' && response.data._id && response.data.courseId) {
          setCourse(response.data);
          setOriginalCoursePrice(response.data.price);
          setDiscountedPrice(response.data.price); // IMPORTANT: Initialize discountedPrice with original price
        } else {
          setFetchError('Invalid course data received: Price, _id, or courseId not found or invalid.');
          console.error('PaymentDetail: Invalid course data received from backend:', response.data);
        }
      } catch (error: any) {
        console.error('PaymentDetail: Error fetching course details:', error.response?.data || error.message);
        setFetchError(`Could not load course details: ${error.message || 'Network error'}. Please check your backend connection.`);
      } finally {
        setLoadingCourse(false); // Make sure loading is always set to false
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    const checkActiveCoupons = async () => {
      if (!courseId) {
        console.log('Skipping coupon check: courseId missing.');
        setShowCouponInput(false); // Hide coupon input if courseId is not available
        return;
      }
      try {
        console.log(`PaymentDetail: Checking for active coupons for courseId: ${courseId} from ${Backend_Main}/api/coupons/active/${courseId}`);
        const response = await axios.get<{ hasActiveCoupons: boolean }>(`${Backend_Main}/api/coupons/active/${courseId}`);
        console.log('PaymentDetail: Active coupon check response:', response.data);
        setShowCouponInput(response.data.hasActiveCoupons);
      } catch (err: any) {
        console.error('PaymentDetail: Error checking active coupons:', err.response?.data || err.message);
        setCouponError(err.response?.data?.message || 'Failed to check coupon availability.');
        setShowCouponInput(false);
      }
    };
    if (courseId) { // Only check if courseId is available
      checkActiveCoupons();
    }
  }, [courseId]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    if (!course || !originalCoursePrice) { // Ensure course and its original price are loaded
      setCouponError('Course details or price not loaded yet.');
      return;
    }

    setApplyingCoupon(true);
    setCouponError(null);
    setCouponApplied(false);

    try {
      console.log(`PaymentDetail: Applying coupon ${couponCode} for course ${course.courseId}`);
      const response = await axios.post(`${Backend_Main}/api/coupons/apply`, {
        couponCode: couponCode.trim(),
        courseId: course.courseId, // CRITICAL FIX: Use course.courseId (the string ID)
      });

      const { finalPrice, discountPercentage } = response.data;
      console.log('PaymentDetail: Coupon applied successfully. New price:', finalPrice);
      setDiscountedPrice(finalPrice); // Update effective price
      setCouponDiscountPercentage(discountPercentage);
      setCouponApplied(true);
      Alert.alert('Success', 'Coupon applied successfully! Price updated.');
    } catch (err: any) {
      console.error('PaymentDetail: Error applying coupon:', err.response?.data || err.message);
      setCouponError(err.response?.data?.message || 'Failed to apply coupon.');
      setDiscountedPrice(originalCoursePrice); // Revert to original price on error
      setCouponApplied(false);
      setCouponDiscountPercentage(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const validateForm = () => {
    let newErrors: { name?: string; email?: string; contact?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!contact.trim()) {
      newErrors.contact = 'Contact Number is required.';
      isValid = false;
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = 'Contact number must be 10 digits.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProceedToCourseDetail = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields and try again.');
      return;
    }
    if (!course || originalCoursePrice === null || discountedPrice === null) {
      Alert.alert('Error', 'Course details or price not loaded yet. Please try again.');
      return;
    }

    const discountAmount = couponApplied && originalCoursePrice !== null && discountedPrice !== null
                          ? (originalCoursePrice - discountedPrice)
                          : undefined;

    // Pass the original course object, but override its price with the final calculated discountedPrice
    navigation.navigate('CourseDetail', {
      course: {
        ...course,
        price: discountedPrice, // This is the FINAL calculated price
      },
      originalCoursePriceDisplay: originalCoursePrice, // Pass the original price for display on next screen
      prefillName: name,
      prefillEmail: email,
      prefillContact: contact,
      couponCodeUsed: couponApplied ? couponCode.trim() : undefined, // NEW: Pass coupon code if applied
      discountApplied: discountAmount, // NEW: Pass the discount amount if applied
    });
  };

  // --- Conditional Rendering for Loading/Error States ---
  if (loadingCourse) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </SafeAreaView>
    );
  }

  if (fetchError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{fetchError}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!course || originalCoursePrice === null || discountedPrice === null) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Critical data missing. Please try navigating again.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  

  // --- Main Render when data is loaded ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={{ uri: course.imageUrl }}
            style={styles.courseImage}
            onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
          />
          <Text style={styles.header}>Enroll in {course.title}</Text>
          <Text style={styles.subHeader}>
            Please provide your details and confirm your payment.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="e.g., Sarang Kumar"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="e.g., sarang.k@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={[styles.input, errors.contact && styles.inputError]}
              placeholder="e.g., 9876543210"
              value={contact}
              onChangeText={setContact}
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
          </View>

          {/* --- Coupon Code Section --- */}
          {showCouponInput && ( // Conditionally render based on backend check
            <View style={styles.couponContainer}>
              <Text style={styles.couponLabel}>Have a coupon code?</Text>
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon code"
                  placeholderTextColor="#999"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                  editable={!applyingCoupon && !couponApplied}
                />
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    (applyingCoupon || couponApplied || !couponCode.trim()) && styles.applyButtonDisabled,
                  ]}
                  onPress={handleApplyCoupon}
                  disabled={applyingCoupon || couponApplied || !couponCode.trim()}
                >
                  {applyingCoupon ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.applyButtonText}>
                      {couponApplied ? 'Applied' : 'Apply'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              {couponError && <Text style={styles.couponErrorText}>{couponError}</Text>}
              {couponApplied && !couponError && (
                <Text style={styles.couponSuccessText}>Coupon applied successfully!</Text>
              )}
            </View>
          )}
          {/* --- End Coupon Code Section --- */}

          {/* Price display - Combined and updated */}
          <View style={styles.priceContainer}>
            {/* Always show original price if available, but crossed out if a coupon is applied */}
            {originalCoursePrice !== null && ( // Ensure originalCoursePrice is NOT null
              <Text style={
                couponApplied
                  ? styles.originalPriceCrossedOut
                  : styles.originalPriceNormal
              }>
                Original Price: ₹{originalCoursePrice.toFixed(2)}
              </Text>
            )}

            <Text style={styles.currentPrice}>
              {/* This line displays the calculated effective price */}
              Final Price: ₹{(discountedPrice !== null ? discountedPrice : (originalCoursePrice || 0)).toFixed(2)}
              {couponApplied && couponDiscountPercentage !== null && (
                <Text style={styles.discountText}> ({couponDiscountPercentage}% Off!)</Text>
              )}
            </Text>

            {/* Conditional info text */}
            {!couponApplied && showCouponInput && (
              <Text style={styles.infoText}>
                Apply a coupon above to get a discount!
              </Text>
            )}
         
          </View>

          {/* Change to navigate to CourseDetail */}
          <TouchableOpacity style={styles.button} onPress={handleProceedToCourseDetail}>
            <Text style={styles.buttonText}>Review & Proceed to Pay</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 36,
  },
  subHeader: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 35,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  formGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  priceContainer: {
    alignItems: 'center',
    marginVertical: 35,
    padding: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  originalPriceCrossedOut: {
    fontSize: 19,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
    marginBottom: 8,
    fontWeight: '500',
  },
  originalPriceNormal: {
    fontSize: 19,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  discountText: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    width: '100%',
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  couponContainer: {
    width: '100%',
    maxWidth: 450,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  couponLabel: {
    fontSize: 17,
    marginBottom: 12,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    marginRight: 15,
    fontSize: 17,
    color: '#333',
    backgroundColor: '#fefefe',
  },
  applyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  applyButtonDisabled: {
    backgroundColor: '#aab8c2',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  couponErrorText: {
    color: '#e74c3c',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500'
  },
  couponSuccessText: {
    color: '#27ae60',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500'
  },
});

export default PaymentDetail;