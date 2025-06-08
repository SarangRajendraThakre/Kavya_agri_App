// screens/RegistrationFormScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/Constants';

const RegistrationFormScreen: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    console.log('Registering:', { name, email });
    // Here you would typically handle form submission, e.g., API call
    alert(`Registration attempted for ${name} (${email})`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register Now!</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Registration</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark || '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text || '#FFFFFF',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: Colors.text || '#FFFFFF',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555555',
  },
  button: {
    backgroundColor: Colors.primary || '#6C63FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: Colors.textLight || '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrationFormScreen;

function alert(arg0: string) {
    throw new Error('Function not implemented.');
}
