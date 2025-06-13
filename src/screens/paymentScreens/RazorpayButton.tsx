import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Course } from '../../navigation/types';

interface RazorpayButtonProps {
  course: Course;
  razorpayKeyId: string;
  backendOrderCreationUrl: string;
  backendPaymentVerificationUrl: string;
  prefillEmail: string;
  prefillContact: string;
  prefillName: string;
  onPaymentSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onPaymentError: (code: string, description: string, reason?: string) => void;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  course,
  razorpayKeyId,
  backendOrderCreationUrl,
  backendPaymentVerificationUrl,
  prefillEmail,
  prefillContact,
  prefillName,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    // Basic validation for course object itself
    if (!course || (!course._id && !course.courseId)) { // Ensure at least one ID exists
      Alert.alert('Error', 'Course data is incomplete for payment. Please go back and try again.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order on Your Backend
      const amountInPaisa = Math.round(course.price * 100); // Razorpay expects amount in smallest unit (paisa for INR)

      // --- CRITICAL CORRECTION HERE ---
      // Use course.courseId (your custom ID) or course._id (MongoDB's ID)
      // Based on your backend, courseId is likely what's expected for lookups.
      const identifierForBackend = course.courseId; // Assuming your backend looks up by 'courseId'

      if (!identifierForBackend) {
          throw new Error('Course ID (courseId) is missing from the course object.');
      }
      // --- END CRITICAL CORRECTION ---

      const orderCreationPayload = {
        amount: amountInPaisa,
        currency: 'INR',
        receipt: `receipt_${Date.now()}_${identifierForBackend}`, // Use the correct identifier
        courseId: identifierForBackend, // <--- THIS IS THE KEY FIX
        userName: prefillName,
        userEmail: prefillEmail,
        userContact: prefillContact,
      };

      console.log('Frontend (RazorpayButton): Sending order creation payload to backend:', orderCreationPayload);

      const createOrderResponse = await fetch(backendOrderCreationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderCreationPayload),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        console.error('Frontend (RazorpayButton): Backend Order Creation Failed Status:', createOrderResponse.status);
        console.error('Frontend (RazorpayButton): Backend Order Creation Error Data:', errorData);
        throw new Error(errorData.message || 'Failed to create order on backend.');
      }

      const orderData = await createOrderResponse.json();
      console.log('Frontend (RazorpayButton): Order created successfully on backend:', orderData);

      if (!orderData.order_id || !orderData.amount || !orderData.currency) {
        throw new Error('Backend did not return valid Razorpay order details (order_id, amount, currency).');
      }

      // 2. Open Razorpay Checkout
      const options = {
        description: course.title,
        image: course.imageUrl || 'https://i.imgur.com/3g7nmjc.png', // Fallback image
        currency: orderData.currency,
        key: razorpayKeyId, // Your live or test Razorpay API Key
        amount: orderData.amount, // Amount from backend (in paisa)
        name: 'Kavya Agri Solutions', // Your business name
        order_id: orderData.order_id, // Order ID from your backend
        prefill: {
          email: prefillEmail,
          contact: prefillContact,
          name: prefillName,
        },
        theme: { color: '#3399CC' }, // Customize primary color
      };

      console.log('Frontend (RazorpayButton): Opening Razorpay Checkout with options:', options);

      const paymentResult = await RazorpayCheckout.open(options);

      console.log('Frontend (RazorpayButton): Razorpay Payment Success Response:', paymentResult);

      // 3. Verify Payment with Your Backend
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentResult;

      const paymentVerificationPayload = {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        // --- CRITICAL CORRECTION HERE TOO ---
        // Ensure you send the same identifier used for order creation
        courseId: identifierForBackend, // <--- USE THE SAME IDENTIFIER
        // --- END CRITICAL CORRECTION ---
        courseName: course.title,
        amountPaid: orderData.amount,
        userName: prefillName,
        userEmail: prefillEmail,
        userContact: prefillContact,
      };

      console.log('Frontend (RazorpayButton): Sending payment verification payload to backend:', paymentVerificationPayload);

      const verifyPaymentResponse = await fetch(backendPaymentVerificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentVerificationPayload),
      });

      if (!verifyPaymentResponse.ok) {
        const errorData = await verifyPaymentResponse.json();
        console.error('Frontend (RazorpayButton): Backend Verification Failed Status:', verifyPaymentResponse.status);
        console.error('Frontend (RazorpayButton): Backend Verification Error Data:', errorData);
        throw new Error(errorData.message || 'Payment verification failed on backend.');
      }

      const verificationData = await verifyPaymentResponse.json();
      console.log('Frontend (RazorpayButton): Payment verification successful on backend:', verificationData);

      if (verificationData.success) {
        onPaymentSuccess(razorpay_payment_id, razorpay_order_id, razorpay_signature);
      } else {
        onPaymentError('VERIFICATION_FAILED_BACKEND', verificationData.message || 'Payment could not be verified by backend.');
      }

    } catch (error: any) {
      console.error('Frontend (RazorpayButton): Payment process failed:', error);
      if (error.code === 2) { // RazorpayCheckout.Error.RZPM_CANCELLED
        onPaymentError('PAYMENT_CANCELLED', 'Payment was cancelled by the user.');
      } else if (error.description) {
        onPaymentError(error.code || 'UNKNOWN_ERROR', error.description);
      } else {
        onPaymentError('NETWORK_OR_OTHER_ERROR', error.message || 'An unexpected error occurred during payment.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePayment}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Pay Now ₹{course.price}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RazorpayButton;