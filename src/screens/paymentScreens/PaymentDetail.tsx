// screens/PaymentDetail.tsx (or forms/PaymentDetailForm.tsx if you prefer)
import React, { useState } from 'react';
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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Course } from '../../navigation/types'; // Adjust path as needed
import { navigate } from '../../utils/NavigationUtils'; // Assuming you have this utility

type PaymentDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentDetail'>;

interface PaymentDetailProps {
  navigation: PaymentDetailScreenNavigationProp;
}

// Define the single course data directly here
const SINGLE_AGRI_COURSE: Course = {
  id: '1',
  title: 'Agri Support Program',
  description: 'Comprehensive support program for modern agriculture techniques, crop management, and market insights. This program provides essential knowledge and tools for optimizing yields and sustainable farming practices.',
  price: 4,
  // --- CHANGE THIS IMAGE URL ---
  // Option 1: Provide a new public image URL
  imageUrl: 'https://kavyaprofiles.s3.ap-south-1.amazonaws.com/profile-images/684bfc3e8146395cc72f4a5a/1749819312098-8c61978c-5708-44f5-a43a-57655bc81e89-646f80aa-2d7b-4d57-9e42-12b54510b87c.jpg', // Example new image URL
  // Option 2: Use a local image if you have one imported (e.g., if you added it to assets)
  // imageUrl: require('../../assets/images/my_new_agri_image.jpg'), // Uncomment and adjust path if using local image
  // Option 3: Leave it empty if you don't want an image
  // imageUrl: '',
};

const PaymentDetail: React.FC<PaymentDetailProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; contact?: string }>({});

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
    } else if (!/^\d{10}$/.test(contact)) { // Basic 10-digit phone number validation
      newErrors.contact = 'Contact number must be 10 digits.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      // Navigate to CourseDetail, passing the hardcoded course and collected prefill data
      navigate('CourseDetail', {
        course: SINGLE_AGRI_COURSE,
        prefillEmail: email,
        prefillContact: contact,
        prefillName: name,
      });
    } else {
      Alert.alert('Validation Error', 'Please correct the highlighted fields and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Enroll in {SINGLE_AGRI_COURSE.title}</Text>
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
            <Text style={styles.originalPrice}>Original Price: ₹1499</Text>
            <Text style={styles.currentPrice}>Current Price: ₹{SINGLE_AGRI_COURSE.price}</Text>
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
});

export default PaymentDetail;