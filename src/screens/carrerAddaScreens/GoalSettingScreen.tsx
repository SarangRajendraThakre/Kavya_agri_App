
// screens/CourseDetailScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView, Button } from 'react-native'; // Added ScrollView for better layout
import { CourseDetailScreenProps, Course } from '../../navigation/types'; // Adjust path if needed
import { goBack } from '../../utils/NavigationUtils';
import { Backend_Main } from '../../utils/Constants';
import RazorpayButton from '../paymentScreens/RazorpayButton';

const GoalSettingScreen: React.FC<CourseDetailScreenProps> = ({ route }) => {
  // Safely extract the course object from route.params
  // It's guaranteed to be a Course object due to your RootDrawerParamList definition,
  // but optional chaining and a fallback (like an empty object cast to Course) is robust.
  const course: Course = route.params?.course ?? {} as Course;

  // --- Payment Callbacks (Optional but Recommended) ---
  const handlePaymentSuccess = (paymentId: string, orderId: string, signature: string) => {
    console.log('Payment successful in CourseDetailScreen:', { paymentId, orderId, signature });
    Alert.alert('Payment Complete!', `You have successfully purchased ${course.title}. Payment ID: ${paymentId}`);

    // Example: Navigate to a confirmation screen or back to CourseList
    // NavigationService.navigate('PaymentConfirmationScreen', {
    //   courseTitle: course.title,
    //   paymentId: paymentId
    // });
    // Or perhaps go back
    // NavigationService.goBack();
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
    console.log(errorMessage); };
  // ---------------------------------------------------

  // Basic check if course data is available
  if (!course || !course.id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course details not found. Please go back.</Text>
        {/* You could add a button to go back here */}
        <Button title="Go Back" onPress={() => goBack()} />
      </View>
    );
  }

  const order_creation_rz_url = Backend_Main + '/payment/razorpay/create-order';
  const verfiy_rz_url = Backend_Main + '/payment/razorpay/verify-payment';

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
      {course.imageUrl && <Image source={{ uri: course.imageUrl }} style={styles.banner} />}
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <Text style={styles.price}>Price: ₹{course.price}</Text>



      {/* The Razorpay Pamyment Button */}
      <RazorpayButton
        course={course}
        // !!! IMPORTANT: Replace with your actual live/test keys and backend URLs !!!
        razorpayKeyId="rzp_live_uBHRfJO7KjWWIb" // Example: "rzp_test_XXXXXXXXXXXXXX"
      backendOrderCreationUrl = {order_creation_rz_url}
        backendPaymentVerificationUrl={verfiy_rz_url}
        // --- Optional Prefill Data (Replace with dynamic user data) ---
        prefillEmail="john.doe@example.com"
        prefillContact="9876543210"
        // --- Optional Callbacks ---
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center', // Center content horizontally
  },
  banner: {
    width: '100%',
    height: 250, // Increased height for better visual
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10, // Slightly rounded corners
    shadowColor: '#000', // Add some shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28, // Larger title
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 17, // Slightly larger description font
    color: '#555',
    marginBottom: 25,
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  price: {
    fontSize: 22, // Larger price font
    fontWeight: 'bold',
    color: '#007bff', // A distinct color for price
    marginBottom: 30,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default GoalSettingScreen;