import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Where can I find the offer of villa and service prices?',
    answer: 'Our detailed price list for villas and services is available upon request. Please contact our sales team directly via email or phone, or visit the "Pricing" section on our website for more information.',
  },
  {
    id: '2',
    question: 'What is included in the price of Accommodation?',
    answer: 'The accommodation price typically includes the nightly rate for the villa, access to all on-site amenities (e.g., pool, gym), basic utilities, and standard cleaning services. Specific inclusions may vary by package; please refer to your booking confirmation.',
  },
  {
    id: '3',
    question: 'What is the procedure for arranging and booking Accommodation?',
    answer: 'To book, select your desired villa and dates on our website, then proceed to the booking form. Fill in your details, review the summary, and make the initial deposit. You will receive a confirmation email shortly after.',
  },
  {
    id: '4',
    question: 'How do I pay the rest of the Accommodation price, at once or in several installments?',
    answer: 'The remaining balance can be paid in full at a specified date before check-in, or you may opt for a personalized installment plan. Please discuss your preferred payment schedule with our booking specialists during the reservation process.',
  },
];

const FAQScreen: React.FC = () => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenItemId(prevId => (prevId === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainHeading}>Frequently asked questions</Text>
        <Text style={styles.description}>
          Everything you need to know about the product and billing.
        </Text>

        {faqData.map(item => (
          <View key={item.id} style={styles.faqItemContainer}>
            <TouchableOpacity
              onPress={() => toggleFAQ(item.id)}
              style={styles.questionButton}
              activeOpacity={0.7}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              <Text style={styles.toggleIcon}>
                {openItemId === item.id ? '-' : '+'}
              </Text>
            </TouchableOpacity>

            {openItemId === item.id && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light background
    paddingTop: 50, // Adjust for status bar or safe area
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  faqItemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden', // Essential for LayoutAnimation on answer content
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
  },
  questionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Lighter border for question
  },
  questionText: {
    flex: 1, // Allows text to take available space
    fontSize: 16,
    color: '#333',
    marginRight: 10, // Space between text and icon
  },
  toggleIcon: {
    fontSize: 24, // Larger for visibility
    fontWeight: 'bold',
    color: '#007AFF', // A pleasant blue for the icon
  },
  answerContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FDFDFD', // Slightly different background for answer
  },
  answerText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default FAQScreen;