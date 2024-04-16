import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import IP from '../assets/assets.js';

const ProfileSettings = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(''); // State to hold the new email
  const [userName, setUserName] = useState(''); // State to hold the new username

  const getUser = async () => {
    try {  
      const response = await fetch('http://' + IP + ':5001/user');
      const json = await response.json();
      setUserName(json.username);
      console.log(json.username);
      
    } catch (error) {
      console.error(error);
    } 
  };
  

  const changePassword = async () => {
    console.log('Old password:', oldPassword);
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (newPassword === oldPassword) {
      Alert.alert('Error', 'New password must be different from old password.');
      return;
    } else {

    // Placeholder for actual password change logic, possibly involving an API call
    try {
      const response = await fetch('http://' + IP + ':5001/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    })

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
      } else {
        // Handle error response from server
        console.error('Change Password Failed');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
    console.log('Password changed successfully.');
  }
  };

  const changeEmail = async () => {
    try {
      const response = await fetch('http://' + IP + ':5001/change_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        Alert.alert('Success', 'Email Changed Successfully.');
        console.log('Email changed successfully.');
      } else {
        // Handle error response from server
        console.error('Change Email Failed');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
    
  
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.welcomeText} onload={getUser()}>Welcome { userName }, update your credentials here!</Text>
      <TextInput
        style={styles.input}
        onChangeText={setOldPassword}
        value={oldPassword}
        placeholder="Old Password"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        placeholder="New Password"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm New Password"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={changePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="New Email"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={changeEmail}>
        <Text style={styles.buttonText}>Update Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20
  }
});

export default ProfileSettings;



