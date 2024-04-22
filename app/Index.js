import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IP from '../assets/assets.js';


const Index = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleEnterPress = async () => {
    try {
      const response = await fetch('http://' + IP + ':5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        navigation.navigate('Home');
      } else {
        // Handle error response from server
        console.error('Login failed');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const handleSkipPress = () => {
    navigation.navigate('Home');
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header}>OCRScribe</Text>
      <Text style={styles.subHeader}>Scan handwritten documents into machine-readable text</Text>
      <StatusBar style="auto" />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, paddingHorizontal: 10 }}
        onChangeText={setUsername}
        value={username}
        placeholder="Username"
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, paddingHorizontal: 10 }}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />      
      <Text>  </Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleEnterPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSkipPress}>
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  skipButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Index;
