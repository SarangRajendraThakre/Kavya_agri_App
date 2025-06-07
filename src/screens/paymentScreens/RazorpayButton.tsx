// components/RazorpayButton.tsx
import React, { useState } from 'react';
import { Button, Alert, StyleSheet, ActivityIndicator, View } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { MMKV } from 'react-native-mmkv';
import { Course } from '../../navigation/types';
import logo from '../../assets/icons/logoT.png'

const storage = new MMKV();

interface RazorpayButtonProps {
  course: Course;
  onPaymentSuccess?: (paymentId: string, orderId: string, signature: string) => void;
  onPaymentError?: (code: string, description: string, reason?: string) => void;
  razorpayKeyId: string;
  backendOrderCreationUrl: string;
  backendPaymentVerificationUrl: string;
  prefillEmail?: string;
  prefillContact?: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  course,
  onPaymentSuccess,
  onPaymentError,
  razorpayKeyId,
  backendOrderCreationUrl,
  backendPaymentVerificationUrl,
  prefillEmail,
  prefillContact,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    if (!course || !course.id || !course.price || !course.description || !course.title) {
      Alert.alert('Error', 'Course details are incomplete. Cannot proceed with payment.');
      setLoading(false);
      return;
    }

    let orderId: string; // Ensure this is definitely a string

    try {
      const backendOrderResponse = await fetch(backendOrderCreationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Example: 'Authorization': `Bearer ${userToken}`, if needed
        },
        body: JSON.stringify({
          amount: course.price * 100,
          currency: 'INR',
          receipt: `receipt_course_${course.id}_${Date.now()}`,
          courseId: course.id,
        }),
      });

      if (!backendOrderResponse.ok) {
        const errorData = await backendOrderResponse.json();
        throw new Error(errorData.message || 'Failed to create order on backend.');
      }

      const orderData = await backendOrderResponse.json();
      if (orderData.order_id) {
        orderId = orderData.order_id;
      } else {
        throw new Error('Backend did not return a valid order_id.');
      }
    } catch (error: any) { // Explicitly type 'error' as 'any' or more specific type if known
      console.error('Error creating order on backend:', error);
      Alert.alert('Payment Error', `Could not create payment order: ${error.message || 'Please try again.'}`);
      setLoading(false);
      return;
    }

    const options = {
      description: course.description,
      image: course.imageUrl ,
      currency: 'INR',
      key: razorpayKeyId,
      amount: course.price * 100,
      name: 'Kavya Agri Innovation',
      order_id: orderId, // Guaranteed to be a string here
      prefill: {
        email: prefillEmail || '',
        contact: prefillContact || '',
      },
      theme: { color: '#F37254' },
    };

    RazorpayCheckout.open(options)
      .then(async (data: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) => {
        Alert.alert('Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);

        const paymentDetails = {
          courseId: course.id,
          courseName: course.title,
          amountPaid: course.price,
          paymentId: data.razorpay_payment_id,
          orderId: data.razorpay_order_id,
          signature: data.razorpay_signature,
          timestamp: new Date().toISOString(),
        };

        try {
          const existingPayments = storage.getString('userPayments');
          const payments = existingPayments ? JSON.parse(existingPayments) : [];
          payments.push(paymentDetails);
          storage.set('userPayments', JSON.stringify(payments));
          console.log('Payment data saved to MMKV:', paymentDetails);
        } catch (mmkvError) {
          console.error('Error saving to MMKV:', mmkvError);
        }

        try {
          const backendVerificationResponse = await fetch(backendPaymentVerificationUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Example: 'Authorization': `Bearer ${userToken}`, if needed
            },
            body: JSON.stringify(paymentDetails),
          });

          const verificationResult = await backendVerificationResponse.json();
          if (verificationResult.success) {
            console.log('Payment data sent to backend and verified successfully!');
            onPaymentSuccess?.(data.razorpay_payment_id, data.razorpay_order_id, data.razorpay_signature);
          } else {
            console.warn('Backend verification failed:', verificationResult.message);
            onPaymentError?.('BACKEND_VERIFICATION_FAILED', verificationResult.message);
          }
        } catch (backendError) {
          console.error('Error sending payment data to backend:', backendError);
          onPaymentError?.('BACKEND_COMMUNICATION_ERROR', 'Failed to send payment data to backend for verification.');
        } finally {
          setLoading(false);
        }
      })
      .catch((error: { code: string; description: string; reason?: string; }) => {
        setLoading(false);
        console.error('Payment Error:', error.code, error.description, error.reason);
        Alert.alert('Payment Failed', error.description);
        onPaymentError?.(error.code, error.description, error.reason);
      });
  };

  return (
    <View style={styles.buttonContainer}>
      <Button
        title={loading ? 'Processing...' : 'Pay Now'}
        onPress={handlePayment}
        disabled={loading}
        color="#F37254" // Example color
      />
      {loading && (
        <ActivityIndicator
          size="small"
          color="#F37254"
          style={styles.spinner}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
  },
  spinner: {
    position: 'absolute',
    right: 20,
    alignSelf: 'center',
  },
});

export default RazorpayButton;