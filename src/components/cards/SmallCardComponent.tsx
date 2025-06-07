import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

// Assuming you have these images in your assets folder
// For demonstration, I'll use generic names. Replace with your actual paths.
const stocksIcon = require('../../assets/icons/google.svg'); // Replace with your actual path
const mutualFundsIcon = require('../../assets/icons/logo.png'); // Replace with your actual path
const futureAndOptionsIcon = require('../../assets/icons/logo.png');// Replace with your actual path
const iposIcon = require('../../assets/icons/logo.png'); // Replace with your actual path
const currenciesIcon = require('../../assets/icons/logo.png'); // Replace with your actual path
const bitCoinsIcon = require('../../assets/icons/logo.png'); // Replace with your actual path

interface InvestmentCardProps {
  icon: any; // Use `any` for require paths, or specify ImageSourcePropType
  label: string;
  onPress: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={icon} style={styles.cardIcon} resizeMode="contain" />
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

const SmallCardComponent: React.FC = () => {
  const handleStartInvesting = () => {
    console.log('Start Investing Pressed');
    // Navigate to investing screen or perform action
  };

  const handleCardPress = (label: string) => {
    console.log(`${label} card pressed`);
    // Navigate to specific investment section
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mainTitle}>One Platforms, Multiple Choices!</Text>
        <Text style={styles.subtitle}>We got something for everyone</Text>

        <TouchableOpacity style={styles.investButton} onPress={handleStartInvesting}>
          <Text style={styles.investButtonText}>Start Investing</Text>
        </TouchableOpacity>

        <View style={styles.cardsGrid}>
          <InvestmentCard
            icon={stocksIcon}
            label="Stocks"
            onPress={() => handleCardPress('Stocks')}
          />
          <InvestmentCard
            icon={mutualFundsIcon}
            label="Mutual Funds"
            onPress={() => handleCardPress('Mutual Funds')}
          />
          <InvestmentCard
            icon={futureAndOptionsIcon}
            label="Future and Options"
            onPress={() => handleCardPress('Future and Options')}
          />
          <InvestmentCard
            icon={iposIcon}
            label="IPOs"
            onPress={() => handleCardPress('IPOs')}
          />
          <InvestmentCard
            icon={currenciesIcon}
            label="Currencies"
            onPress={() => handleCardPress('Currencies')}
          />
          <InvestmentCard
            icon={bitCoinsIcon}
            label="Bit coins" // Note: "Bit coins" is usually spelled "Bitcoin" or "Cryptocurrencies"
            onPress={() => handleCardPress('Bit coins')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Or your desired background color
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  investButton: {
    backgroundColor: '#fff', // White background
    borderColor: '#FF6347', // Tomato red border
    borderWidth: 1,
    borderRadius: 25, // Half of height for rounded shape
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 40,
    shadowColor: '#000', // Optional: subtle shadow for button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  investButtonText: {
    color: '#FF6347', // Tomato red text
    fontSize: 18,
    fontWeight: '600',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5, // Adjust for spacing
  },
  card: {
    width: '48%', // Approximately half width for two cards per row, adjust for spacing
    backgroundColor: '#FFF0F5', // Lavender blush background
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15, // Space between rows
    aspectRatio: 1, // Make cards square
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 60, // Adjust icon size as needed
    height: 60, // Adjust icon size as needed
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default SmallCardComponent;