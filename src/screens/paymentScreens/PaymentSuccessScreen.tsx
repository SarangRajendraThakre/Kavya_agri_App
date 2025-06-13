// screens/PaymentSuccessScreen.tsx
import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types'; // Adjust path as needed
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Using MaterialCommunityIcons for the checkmark

// Define the types for the route and navigation props based on your RootStackParamList
type PaymentSuccessScreenRouteProp = RouteProp<RootStackParamList, 'PaymentSuccess'>;
type PaymentSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSuccess'>;

interface PaymentSuccessScreenProps {
  route: PaymentSuccessScreenRouteProp;
  navigation: PaymentSuccessScreenNavigationProp;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ route, navigation }) => {
  // Destructure payment details from route.params
  const {
    courseName,
    amountPaid,
    paymentId,
    orderId,
    paymentDate,
    userName,
    userEmail,
    userContact,
  } = route.params;

  // Format date for user-friendly display
  const formattedDate = paymentDate
    ? new Date(paymentDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  // Convert amount from paisa to rupees and format to 2 decimal places
  const displayAmount = (amountPaid / 100).toFixed(2);

  // Callback function to navigate back to the Home screen, resetting the stack
  const handleGoToHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Parent', // The name of the stack screen that holds your Drawer Navigator
            state: {
              routes: [
                {
                  name: 'Main', // The name of the Drawer screen (from RootDrawerParamList)
                  state: {
                    routes: [
                      {
                        name: 'Home', // The name of the tab/screen inside 'Main' (from RootTabParamList)
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      })
    );
  }, [navigation]);

  // Handle navigation to "My Courses" (currently an alert and then home)
  const handleGoToMyCourses = () => {
    Alert.alert('Feature Coming Soon', 'Your purchased courses will be available in a "My Courses" section!', [
      { text: 'OK', onPress: handleGoToHome }, // Go home after acknowledging
    ]);
  };

  useEffect(() => {
    console.log('PaymentSuccessScreen mounted with details:', route.params);
  }, [route.params]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <Icon name="check-circle-outline" size={90} color="#27ae60" style={styles.successIcon} />

        {/* Header Texts */}
        <Text style={styles.headerText}>Payment Successful!</Text>
        <Text style={styles.subHeaderText}>Thank you for your purchase.</Text>

        {/* Payment Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Course:</Text>
            <Text style={styles.detailValue}>{courseName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid:</Text>
            <Text style={styles.detailValue}>₹{displayAmount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment ID:</Text>
            <Text style={styles.detailValue}>{paymentId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>
        </View>

        {/* User Information Section */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoHeader}>Purchased By:</Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.userInfoLabel}>Name:</Text> {userName}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.userInfoLabel}>Email:</Text> {userEmail}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.userInfoLabel}>Contact:</Text> {userContact}
          </Text>
        </View>

        {/* Confirmation Message */}
        <Text style={styles.confirmationMessage}>
          A confirmation email has been sent to **{userEmail}** with your course access details.
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleGoToMyCourses}>
          <Text style={styles.buttonText}>Go to My Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleGoToHome}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e9f7ef', // Light green background for a positive feel
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center', // Center content horizontally
    paddingTop: Platform.OS === 'android' ? 40 : 20, // More top padding for full screen
  },
  successIcon: {
    marginBottom: 20,
    marginTop: 20, // Add some top margin for the icon
  },
  headerText: {
    fontSize: 32, // Slightly larger for prominence
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 19, // Slightly larger
    color: '#34495e',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 28,
  },
  detailsContainer: { // New container for payment details
    backgroundColor: '#ffffff',
    borderRadius: 15, // Slightly less round than a card
    padding: 20,
    width: '100%',
    maxWidth: 500, // Max width for readability on larger screens
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  userInfoContainer: {
    width: '100%',
    maxWidth: 500, // Match detailsContainer width
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginTop: 15, // Adjusted margin
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  userInfoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingBottom: 8,
  },
  userInfoText: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 5,
  },
  userInfoLabel: {
    fontWeight: 'bold',
    color: '#1abc9c',
  },
  confirmationMessage: {
    fontSize: 16, // Slightly larger
    color: '#555',
    marginTop: 15,
    marginBottom: 30, // More space before buttons
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    width: '100%',
    maxWidth: 500, // Limit width for readability
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16, // Slightly more padding
    paddingHorizontal: 35,
    borderRadius: 12, // More rounded corners
    width: '90%', // Fill more width
    maxWidth: 400, // Max width for buttons
    alignItems: 'center',
    marginTop: 15, // Adjusted margin
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 6 }, // More pronounced shadow
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19, // Slightly larger
    fontWeight: 'bold',
    letterSpacing: 0.8, // More spacing
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
    marginTop: 15,
    shadowColor: '#95a5a6',
    shadowOpacity: 0.25,
    elevation: 6,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 17, // Slightly larger
    fontWeight: '600',
  },
});

export default PaymentSuccessScreen;