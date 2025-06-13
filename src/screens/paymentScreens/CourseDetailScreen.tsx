// screens/CourseDetailScreen.tsx (Corrected)
import React from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView, Button } from 'react-native';
import { CourseDetailScreenProps, Course } from '../../navigation/types';
import { goBack } from '../../utils/NavigationUtils';
import { Backend_Main } from '../../utils/Constants';
import RazorpayButton from './RazorpayButton';
import { useNavigation } from '@react-navigation/native';

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation<CourseDetailScreenProps['navigation']>();

  const course: Course | undefined = route.params?.course; // Ensure it can be undefined
  const prefillEmail = route.params?.prefillEmail || '';
  const prefillContact = route.params?.prefillContact || '';
  const prefillName = route.params?.prefillName || '';

  // console.log('Course Image URL:', course?.imageUrl); // For debugging
  // console.log('Course object received in CourseDetailScreen:', course); // Add this for debugging

  // --- CRITICAL CORRECTION HERE ---
  // Change !course.id to !course._id
  if (!course || !course._id) { // Use _id as per your Course type
    console.error('Course object or its _id is missing in CourseDetailScreen:', course); // Log the issue
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course details not found. Please go back.</Text>
        <Button title="Go Back" onPress={() => goBack()} />
      </View>
    );
  }
  // --- END CRITICAL CORRECTION ---

  const handlePaymentSuccess = (paymentId: string, orderId: string, signature: string) => {
    console.log('Payment successful in CourseDetailScreen:', { paymentId, orderId, signature });

    navigation.replace('PaymentSuccess', {
      courseName: course.title,
      amountPaid: course.price * 100, // Amount in paisa
      paymentId: paymentId,
      orderId: orderId,
      paymentDate: new Date().toISOString(),
      userName: prefillName,
      userEmail: prefillEmail,
      userContact: prefillContact,
    });
  };

  const handlePaymentError = (code: string, description: string, reason?: string) => {
    console.error('Payment failed in CourseDetailScreen:', { code, description, reason });
    let errorMessage = 'Payment could not be completed. Please try again.';

    if (code === 'PAYMENT_CANCELLED') {
      errorMessage = 'Payment was cancelled by the user.';
    } else if (description) {
      errorMessage = `Payment failed: ${description}`;
    }

    Alert.alert('Payment Failed', errorMessage);
  };

  const order_creation_rz_url = Backend_Main + '/payment/razorpay/create-order';
  const verfiy_rz_url = Backend_Main + '/payment/razorpay/verify-payment';

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
      {course.imageUrl ? ( // Conditional render for image to avoid broken image icon
        <Image source={{ uri: course.imageUrl }} style={styles.banner} />
      ) : (
        <View style={styles.noImageBanner}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.originalPrice}>Original Price: ₹1499</Text> {/* You might want to pass this from backend too */}
        <Text style={styles.currentPrice}>Special Price: ₹{course.price}</Text>
        <Text style={styles.discountMessage}>Don't miss this limited-time offer!</Text>
      </View>

      <View style={styles.userDetailsContainer}>
        <Text style={styles.userDetailsHeader}>Your Details:</Text>
        {prefillName && <Text style={styles.userDetailsText}><Text style={styles.userDetailsLabel}>Name:</Text> {prefillName}</Text>}
        {prefillEmail && <Text style={styles.userDetailsText}><Text style={styles.userDetailsLabel}>Email:</Text> {prefillEmail}</Text>}
        {prefillContact && <Text style={styles.userDetailsText}><Text style={styles.userDetailsLabel}>Contact:</Text> {prefillContact}</Text>}
        <Text style={styles.reviewText}>Please review before proceeding.</Text>
      </View>

      <RazorpayButton
        course={course}
        razorpayKeyId="rzp_live_uBHRfJO7KjWWIb" // Keep your actual key
        backendOrderCreationUrl={order_creation_rz_url}
        backendPaymentVerificationUrl={verfiy_rz_url}
        prefillEmail={prefillEmail}
        prefillContact={prefillContact}
        prefillName={prefillName}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  noImageBanner: {
    width: '100%',
    height: 250,
    marginBottom: 25,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 18,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
    lineHeight: 38,
  },
  description: {
    fontSize: 17,
    color: '#555',
    marginBottom: 30,
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#eaf4f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0e0e8',
    width: '100%',
  },
  originalPrice: {
    fontSize: 20,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
    marginBottom: 5,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  discountMessage: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  userDetailsContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  userDetailsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 10,
  },
  userDetailsText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
  },
  userDetailsLabel: {
    fontWeight: 'bold',
    color: '#1abc9c',
  },
  reviewText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
});
export default CourseDetailScreen;