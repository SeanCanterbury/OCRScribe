import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet, StatusBar } from 'react-native';
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.Header}>OCRScribe</Text>
      <Text>Scan handwritten documents into machine-readable text</Text>
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
      <StatusBar style="auto" />
      <Button title="Enter" onPress={handleEnterPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Header: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: "center",
  },
});

export default Index;
