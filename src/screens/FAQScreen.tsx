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
import Ionicons from 'react-native-vector-icons/Ionicons'; // For a modern chevron icon

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Color Palette (Modern Style) ---
const Colors = {
  primaryAccent: '#2A9D8F', // Teal/Blue accent
  darkText: '#264653',     // Dark charcoal
  lightText: '#6C7A89',    // Muted grey
  cardBackground: '#FFFFFF',
  screenBackground: '#F0F2F5', // Light grey background
  shadowColor: '#000',
  borderColor: '#E8E8E8',
};

interface FAQItem {
  id: string; // Unique ID for each FAQ item
  question: string;
  answer: string;
  category: string; // Added category field
}

// --- Your new FAQ Data, categorized ---
const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is the Career Development & Guidance Program?',
    answer: 'This is a skill-building and career guidance platform for agriculture students to prepare for jobs, interviews, and industry opportunities.',
    category: 'About the Program',
  },
  {
    id: '2',
    question: 'Who can join this program?',
    answer: 'Students pursuing or completed B.Sc. (Agri/Horti), M.Sc., Diploma in Agriculture, or anyone interested in Agri careers can join.',
    category: 'About the Program',
  },
  {
    id: '3',
    question: 'What kind of support does the program offer?',
    answer: 'We offer training, expert sessions, interview preparation, career counseling, job updates, and more.',
    category: 'About the Program',
  },
  {
    id: '4',
    question: 'What topics are covered in the course?',
    answer: 'Topics include Agri Input Industry, Agri-Banking, Agronomy, Organic Certification, Post-Harvest, Horticulture, Resume & Interview Skills, etc.',
    category: 'Course & Learning',
  },
  {
    id: '5',
    question: 'Is the course available in Marathi languages?',
    answer: 'Yes, This course is available in Marathi.',
    category: 'Course & Learning',
  },
  {
    id: '6',
    question: 'Are these live classes or recorded sessions?',
    answer: 'Both. We offer recorded modules and live doubt-clearing or expert sessions.',
    category: 'Course & Learning',
  },
  {
    id: '7', // Corrected ID from previous 8
    question: 'How do I register for a course?',
    answer: 'Click “Enrol Now.” Fill in your details and complete the payment.',
    category: 'Enrolment & Payment',
  },
  {
    id: '8', // Corrected ID from previous 9
    question: 'What payment methods are accepted?',
    answer: 'We accept UPI, debit/credit cards, net banking, and wallets.',
    category: 'Enrolment & Payment',
  },
  {
    id: '9', // Corrected ID from previous 10
    question: 'I made a payment, but the course is not unlocked. What should I do?',
    answer: 'Please wait a few minutes. If access is still not granted, contact support with your transaction ID.',
    category: 'Enrolment & Payment',
  },
  {
    id: '10', // Corrected ID from previous 11
    question: 'Is there any refund policy?',
    answer: 'Refunds are only available for duplicate payments or technical errors, as per our refund policy.',
    category: 'Enrolment & Payment',
  },
  {
    id: '11', // Corrected ID from previous 12
    question: 'Will I get a certificate after completing the course?',
    answer: 'Yes, a certificate will be issued after successful completion of the course.',
    category: 'Certificates',
  },
  {
    id: '12', // Corrected ID from previous 13
    question: 'Is the certificate recognized for job applications?',
    answer: 'Yes, it adds value to your resume and is helpful for interviews.',
    category: 'Certificates',
  },
  {
    id: '13', // Corrected ID from previous 14
    question: 'Do you provide job placement support?',
    answer: 'We guide students for job preparation, share job updates, and provide interview and resume support.',
    category: 'Career Support',
  },
  {
    id: '14', // Corrected ID from previous 15
    question: 'Will I get interview preparation help?',
    answer: 'Yes, we offer interview practice sessions, mock interviews, and tips from experts.',
    category: 'Career Support',
  },
  {
    id: '15', // Corrected ID from previous 16
    question: 'How can I improve my resume for agri jobs?',
    answer: 'We offer resume-building tips and templates tailored for agri-sector jobs.',
    category: 'Career Support',
  },
  {
    id: '16', // Corrected ID from previous 17
    question: 'Who are the trainers in this program?',
    answer: 'Our leadership team consists of experienced agri-professionals with 6+ years of industry expertise in different domains.',
    category: 'Expert Sessions & Mentors',
  },
  {
    id: '17', // Corrected ID from previous 18
    question: 'Can I connect with mentors individually?',
    answer: 'Yes, you can submit your request through “Help and Support” and our team will get back to you.',
    category: 'Expert Sessions & Mentors',
  },
  {
    id: '18', // Corrected ID from previous 19
    question: 'I’m not able to log into the app. What should I do?',
    answer: 'Check your network connection and make sure your credentials are correct. If not resolved, contact us on +91-9307050583. or send a mail at kavyaagriinnovations@outlook.com',
    category: 'Technical Help',
  },
  {
    id: '19', // Corrected ID from previous 20
    question: 'I didn’t receive the OTP while registering.',
    answer: 'Check your E-Mail id and request OTP again. If not resolved, contact us on 9307050583 or send a mail at kavyaagriinnovations@outlook.com',
    category: 'Technical Help',
  },
  {
    id: '20', // Corrected ID from previous 22
    question: 'How can I contact support?',
    answer: 'You can reach us via in-app, email at kavyaagriinnovations@outlook.com, or call/WhatsApp at +91-9307050583.',
    category: 'Contact & Support',
  },
  {
    id: '21', // Corrected ID from previous 23
    question: 'Where can I raise a ticket for help?',
    answer: 'Go to the “Help & Support” section and click “Raise Query.”',
    category: 'Contact & Support',
  },
];

// Group FAQs by category for easier rendering
const categorizedFaqs: Record<string, FAQItem[]> = faqData.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, FAQItem[]>);

// Emojis for categories based on your provided list
const categoryEmojis: Record<string, string> = {
  'About the Program': '💡',
  'Course & Learning': '📚',
  'Enrolment & Payment': '💰',
  'Certificates': '🏅',
  'Career Support': '💼',
  'Expert Sessions & Mentors': '👩‍🏫',
  'Technical Help': '🛠️',
  'Contact & Support': '📞',
};

const FAQScreen: React.FC = () => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    // Configure LayoutAnimation for next layout changes
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenItemId(prevId => (prevId === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainHeading}>Frequently Asked Questions</Text>
        <Text style={styles.description}>
          Find answers to the most common questions about our programs and services.
        </Text>

        {/* Iterate over categories */}
        {Object.keys(categorizedFaqs).map(category => (
          <View key={category}>
            <Text style={styles.categoryHeading}>
              {categoryEmojis[category] || ''} {category}
            </Text>
            {/* Iterate over FAQ items within each category */}
            {categorizedFaqs[category].map(item => (
              <View key={item.id} style={styles.faqItemContainer}>
                <TouchableOpacity
                  onPress={() => toggleFAQ(item.id)}
                  style={styles.questionButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Ionicons
                    name={openItemId === item.id ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={24}
                    color={Colors.primaryAccent}
                  />
                </TouchableOpacity>

                {/* Conditionally render the answer section */}
                {openItemId === item.id && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
    paddingTop: 50, // Adjust for status bar or safe area
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.darkText,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.lightText,
    lineHeight: 22,
  },
  categoryHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkText,
    marginTop: 25,
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primaryAccent, // Accent color for category
    paddingVertical: 4,
  },
  faqItemContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Android shadow
    overflow: 'hidden', // Essential for LayoutAnimation to clip content properly
  },
  questionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth, // Thin, subtle line
    borderBottomColor: Colors.borderColor,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkText,
    marginRight: 15,
    lineHeight: 22,
  },
  answerContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.cardBackground, // Keep same background as card
    borderTopWidth: StyleSheet.hairlineWidth, // Add a subtle top border for separation
    borderTopColor: Colors.borderColor,
  },
  answerText: {
    fontSize: 14,
    color: Colors.lightText,
    lineHeight: 22,
  },
});

export default FAQScreen;