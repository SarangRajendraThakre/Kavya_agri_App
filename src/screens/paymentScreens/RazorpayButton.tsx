import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Course } from '../../navigation/types'; // Adjust path based on your project structure

interface RazorpayButtonProps {
  course: Course;
  razorpayKeyId: string;
  backendOrderCreationUrl: string;
  backendPaymentVerificationUrl: string;
  prefillEmail: string;    // Already handled with `|| ''` in parent
  prefillContact: string;  // Already handled with `|| ''` in parent
  prefillName: string;     // Already handled with `|| ''` in parent
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

    try {
      // 1. Create Order on Your Backend
      const amountInPaisa = Math.round(course.price * 100); // Razorpay expects amount in smallest unit (paisa for INR)

      const orderCreationPayload = {
        amount: amountInPaisa,
        currency: 'INR', // Ensure this matches your backend's expectation
        receipt: `receipt_${Date.now()}_${course.id}`, // Unique receipt for each order
        courseId: course.id,
        userName: prefillName,
        userEmail: prefillEmail,
        userContact: prefillContact,
        // Any other fields your backend's /create-order endpoint requires
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
        courseId: course.id,
        courseName: course.title,
        amountPaid: orderData.amount, // Send the same amount (in paisa) used for order creation
        userName: prefillName,
        userEmail: prefillEmail,
        userContact: prefillContact,
        // You might want to send timestamp if your backend requires it
        // timestamp: new Date().toISOString(),
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
        // Backend indicated verification failed despite Razorpay success
        onPaymentError('VERIFICATION_FAILED_BACKEND', verificationData.message || 'Payment could not be verified by backend.');
      }

    } catch (error: any) {
      console.error('Frontend (RazorpayButton): Payment process failed:', error);
      // Determine the error type to provide a more specific message
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
      disabled={loading} // Disable button while processing
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
    backgroundColor: '#007bff', // Example primary blue
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
    elevation: 8, // For Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RazorpayButton;