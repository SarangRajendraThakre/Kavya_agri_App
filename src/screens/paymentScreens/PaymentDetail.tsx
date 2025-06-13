// screens/PaymentDetail.tsx (Modified to fetch course)
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
  ActivityIndicator, // Add ActivityIndicator for loading state
} from 'react-native';
import { StackNavigationProp, RouteProp } from '@react-navigation/stack'; // Import RouteProp
import { RootStackParamList, Course } from '../../navigation/types';
import { navigate } from '../../utils/NavigationUtils';
import {  Backend_Main } from '../../utils/Constants'; // Assuming Constants has Backend_Main

// Update the type to include route
type PaymentDetailScreenRouteProp = RouteProp<RootStackParamList, 'PaymentDetail'>;
type PaymentDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentDetail'>;

interface PaymentDetailProps {
  route: PaymentDetailScreenRouteProp; // Add route prop
  navigation: PaymentDetailScreenNavigationProp;
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({ route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; contact?: string }>({});
  const [course, setCourse] = useState<Course | null>(null); // State to hold fetched course
  const [loadingCourse, setLoadingCourse] = useState(true); // Loading state for course fetch
  const [fetchError, setFetchError] = useState<string | null>(null); // Error state for course fetch

  const courseId = 'AGRI001';
  // Effect to fetch course details when component mounts or courseId changes
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setFetchError('No course ID provided.');
        setLoadingCourse(false);
        return;
      }

      setLoadingCourse(true);
      setFetchError(null);
      try {
        const response = await fetch(`${Backend_Main}/api/courses/${courseId}`); // Adjust this API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.statusText}`);
        }
        const data: Course = await response.json();
        setCourse(data);
      } catch (error: any) {
        console.error('Error fetching course details:', error);
        setFetchError(`Could not load course: ${error.message}`);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]); // Re-run if courseId changes

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

  const handleProceedToPayment = () => {
    if (!course) {
      Alert.alert('Error', 'Course details are not loaded yet. Please wait or try again.');
      return;
    }
    if (validateForm()) {
      // Navigate to CourseDetail, passing the dynamically fetched course and collected prefill data
      navigate('CourseDetail', {
        course: course, // <--- KEY CHANGE: Pass the fetched course object
        prefillEmail: email,
        prefillContact: contact,
        prefillName: name,
      });
    } else {
      Alert.alert('Validation Error', 'Please correct the highlighted fields and try again.');
    }
  };

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
        {/* You might want a "Retry" button here */}
      </SafeAreaView>
    );
  }

  if (!course) {
    // This case should ideally be caught by fetchError, but as a fallback
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Course not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Enroll in {course.title}</Text> {/* Use fetched course.title */}
          <Text style={styles.subHeader}>
            Please provide your details to proceed with your enrollment.
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

          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>Original Price: ₹1499</Text> {/* You might want to fetch original price too */}
            <Text style={styles.currentPrice}>Current Price: ₹{course.price}</Text> {/* Use fetched course.price */}
            <Text style={styles.discountText}>🎉 Great discount applied!</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleProceedToPayment}>
            <Text style={styles.buttonText}>Proceed to Payment</Text>
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
  originalPrice: {
    fontSize: 20,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
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
    fontSize: 16,
    color: '#2980b9',
    fontWeight: '600',
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
  loadingContainer: { // New style for loading state
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: { // New style for loading text
    marginTop: 15,
    fontSize: 18,
    color: '#555',
  },
});

export default PaymentDetail;