// screens/RazorpayButton.tsx

import React from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { Course } from '../../navigation/types';

interface RazorpayButtonProps {
  course: Course; // This course object will have the final calculated price
  razorpayKeyId: string;
  backendOrderCreationUrl: string;
  backendPaymentVerificationUrl: string;
  prefillEmail: string;
  prefillContact: string;
  prefillName: string;
  couponCodeUsed?: string; // NEW: Added optional prop for coupon code
  discountApplied?: number; // NEW: Added optional prop for discount amount
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
  couponCodeUsed, // Destructure new prop
  discountApplied, // Destructure new prop
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    if (loading) return; // Prevent double clicks
    setLoading(true);

    if (!razorpayKeyId || razorpayKeyId === 'rzp_test_YOUR_KEY_ID') { // Added check for placeholder
        setLoading(false);
        return;
    }
    if (!course._id) { // Ensure MongoDB _id is present for backend linking
      setLoading(false);
      return;
    }

    try {
      // course.price is the final price (original or discounted) passed from PaymentDetail
      const amountInPaisa = Math.round(course.price * 100);

      // --- CRUCIAL FIX: GENERATE A SHORTER RECEIPT HERE ---
      // Using last 10 chars of course._id (MongoDB ObjectId is 24 chars) + last 6 chars of timestamp.
      const shortCourseId = course._id.slice(-10);
      const shortTimestamp = Date.now().toString().slice(-6);
      const receiptValue = `R${shortCourseId}-${shortTimestamp}`; // Example: R5b8c3d7-567890 (1+10+1+6 = 18 chars)
                                                                // This is well within Razorpay's 40-character limit.
      // ---------------------------------------------------


      // Step 1: Create order on your backend
      console.log('RazorpayButton: Creating order on backend...');
      const orderResponse = await axios.post(backendOrderCreationUrl, {
        amount: amountInPaisa,
        currency: 'INR',
        receipt: receiptValue, // <--- NOW USING THE SHORTENED RECEIPT HERE!
        courseId: course._id, // Pass MongoDB ObjectId to backend for payment record linkage
        courseName: course.title,
        userName: prefillName,
        userEmail: prefillEmail,
        userContact: prefillContact,
        couponCodeUsed: couponCodeUsed, // NEW: Pass coupon details to backend
        discountApplied: discountApplied, // NEW: Pass discount amount to backend
      });

      const { order_id: orderId, amount, currency } = orderResponse.data;
      console.log('RazorpayButton: Order created with ID:', orderId);

      // Step 2: Open Razorpay Checkout
      const options = {
        description: `Payment for ${course.title}`,
        image: course.imageUrl || 'https://i.imgur.com/3g7nmjc.png', // Fallback image
        currency: currency,
        key: razorpayKeyId,
        amount: amount, // Amount from backend order response
        name: 'Kavya Agri Courses',
        order_id: orderId,
        prefill: {
          email: prefillEmail,
          contact: prefillContact,
          name: prefillName,
        },
        theme: { color: '#007bff' },
      };

      console.log('RazorpayButton: Opening Razorpay checkout...');
      const paymentResponse = await RazorpayCheckout.open(options);
      console.log('RazorpayButton: Payment successful from Razorpay. Verifying...');

      // Step 3: Verify payment on your backend
      await axios.post(backendPaymentVerificationUrl, {
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        courseId: course._id, // Pass MongoDB ObjectId again for final payment record
        courseName: course.title,
        amountPaid: amount,
        userEmail: prefillEmail,
        userName: prefillName,
        userContact: prefillContact,
        couponCodeUsed: couponCodeUsed, // NEW: Pass coupon details to backend for verification and coupon usage increment
        discountApplied: discountApplied, // NEW: Pass discount amount to backend
      });

      console.log('RazorpayButton: Payment verified successfully on backend.');
      onPaymentSuccess(
        paymentResponse.razorpay_payment_id,
        paymentResponse.razorpay_order_id,
        paymentResponse.razorpay_signature
      );

    } catch (error: any) {
      console.error('RazorpayButton Payment Error:', error.response?.data || error.message);
      let errorCode = error.code || 'UNKNOWN_ERROR';
      let errorDescription = error.description || 'An error occurred during payment.';
      let errorMessageDetail = error.message;

      // Handle specific RazorpayCheckout errors
      if (error.code === 2) { // RZ specific error code for user cancellation
        errorCode = 'PAYMENT_CANCELLED';
        errorDescription = 'Payment was cancelled by the user.';
      } else if (error.code === 1) { // RZ specific error code for network/sdk issues
        errorCode = 'NETWORK_ERROR';
        errorDescription = 'Payment could not be initiated due to a network error or SDK issue.';
      }
      onPaymentError(errorCode, errorDescription, errorMessageDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.payButton}
      onPress={handlePayment}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.payButtonText}>Pay Now ₹{course.price.toFixed(2)}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  payButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RazorpayButton;