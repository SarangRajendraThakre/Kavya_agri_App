// components/RazorpayButton.tsx
import React, { useState } from 'react';
import { Button, Alert, StyleSheet, ActivityIndicator, View } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { MMKV } from 'react-native-mmkv';
import { Course } from '../../navigation/types';
import logo from '../../assets/icons/logoT.png' // Ensure this path is correct if used

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

        // ADD LOG: Course details before payment process
        console.log('Frontend: Course details for payment:', course);

        if (!course || !course.id || !course.price || !course.description || !course.title) {
            Alert.alert('Error', 'Course details are incomplete. Cannot proceed with payment.');
            console.error('Frontend: Incomplete course details detected:', course);
            setLoading(false);
            return;
        }

        let orderId: string;

        try {
            const orderPayload = {
                amount: course.price * 100, // Convert to paisa
                currency: 'INR',
                receipt: `receipt_course_${course.id}_${Date.now()}`,
                courseId: course.id,
            };
            // ADD LOG: Payload sent to backend for order creation
            console.log('Frontend: Sending order creation payload to backend:', orderPayload);
            console.log('Frontend: Backend Order Creation URL:', backendOrderCreationUrl);


            const backendOrderResponse = await fetch(backendOrderCreationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            // ADD LOG: Raw response from backend order creation
            console.log('Frontend: Backend Order Creation Response Status:', backendOrderResponse.status);


            if (!backendOrderResponse.ok) {
                const errorData = await backendOrderResponse.json();
                console.error('Frontend: Error response from backend order creation:', errorData);
                throw new Error(errorData.message || 'Failed to create order on backend.');
            }

            const orderData = await backendOrderResponse.json();
            // ADD LOG: Parsed success response from backend order creation
            console.log('Frontend: Successful order data from backend:', orderData);


            if (orderData.order_id) {
                orderId = orderData.order_id;
            } else {
                console.error('Frontend: Backend did not return a valid order_id in success response.');
                throw new Error('Backend did not return a valid order_id.');
            }
        } catch (error: any) {
            console.error('Frontend: Error creating order on backend:', error);
            Alert.alert('Payment Error', `Could not create payment order: ${error.message || 'Please try again.'}`);
            setLoading(false);
            return;
        }

        const options = {
            description: course.description,
            // Ensure this image URL is publicly accessible. logo is a local asset.
            image: course.imageUrl, // FALLBACK: Provide a generic image if course.imageUrl is bad
            currency: 'INR',
            key: razorpayKeyId,
             amount: Math.round(course.price * 100),
            name: 'Kavya Agri Innovation',
            order_id: orderId,
            prefill: {
                email: prefillEmail || '',
                contact: prefillContact || '',
            },
            theme: { color: '#F37254' },
        };

        // ADD LOG: Options object passed to RazorpayCheckout.open
        console.log('Frontend: Options passed to RazorpayCheckout.open:', options);


        RazorpayCheckout.open(options)
            .then(async (data: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) => {
                // ADD LOG: Raw data received from Razorpay successful payment
                console.log('Frontend: Razorpay successful payment data:', data);
                Alert.alert('Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);

                const paymentDetails = {
                    courseId: course.id,
                    courseName: course.title,
                    amountPaid: course.price * 100, // This is in rupees as per your schema, adjust if needed
                    razorpay_payment_id: data.razorpay_payment_id, // Ensure names match backend expectation
                    razorpay_order_id: data.razorpay_order_id,
                    razorpay_signature: data.razorpay_signature,
                    timestamp: new Date().toISOString(),
                };

                // ADD LOG: Payment details prepared for MMKV and backend verification
                console.log('Frontend: Payment details prepared for backend verification:', paymentDetails);

                try {
                    // MMKV storage (consider saving AFTER backend verification for full certainty)
                    const existingPayments = storage.getString('userPayments');
                    const payments = existingPayments ? JSON.parse(existingPayments) : [];
                    payments.push(paymentDetails);
                    storage.set('userPayments', JSON.stringify(payments));
                    console.log('Frontend: Payment data saved to MMKV (temporarily before backend verification):', paymentDetails);
                } catch (mmkvError) {
                    console.error('Frontend: Error saving to MMKV:', mmkvError);
                }

                try {
                    console.log('Frontend: Sending payment details to backend for verification:', backendPaymentVerificationUrl);
                    const backendVerificationResponse = await fetch(backendPaymentVerificationUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(paymentDetails),
                    });

                    // ADD LOG: Raw response from backend payment verification
                    console.log('Frontend: Backend Payment Verification Response Status:', backendVerificationResponse.status);


                    const verificationResult = await backendVerificationResponse.json();
                    // ADD LOG: Parsed response from backend payment verification
                    console.log('Frontend: Backend Payment Verification Result:', verificationResult);


                    if (verificationResult.success) {
                        console.log('Frontend: Payment data sent to backend and verified successfully!');
                        onPaymentSuccess?.(data.razorpay_payment_id, data.razorpay_order_id, data.razorpay_signature);
                    } else {
                        console.warn('Frontend: Backend verification failed:', verificationResult.message);
                        onPaymentError?.('BACKEND_VERIFICATION_FAILED', verificationResult.message);
                    }
                } catch (backendError) {
                    console.error('Frontend: Error sending payment data to backend for verification:', backendError);
                    onPaymentError?.('BACKEND_COMMUNICATION_ERROR', 'Failed to send payment data to backend for verification.');
                } finally {
                    setLoading(false);
                }
            })
            .catch((error: { code: string; description: string; reason?: string; }) => {
                setLoading(false);
                // ADD LOG: Razorpay payment cancellation or error
                console.error('Frontend: Razorpay Checkout Error/Cancellation:', error.code, error.description, error.reason);
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
                color="#F37254"
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