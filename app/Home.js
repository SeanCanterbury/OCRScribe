// app/Home.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to OCRScribe!</Text>
      {/* Content */}
      <View style={styles.content}>
        {/* Main content */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Files')}
        >
          <Text style={styles.buttonText}>Access Files</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Scanning')}
        >
          <Text style={styles.buttonText}>Start Scanning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>
        <Text style={styles.navText}>© OCRScribe 2024</Text>
        <View style={styles.navButtons}>
          <Button title="Help" onPress={() => {}} />
          <Button title="Settings" onPress={() => {}} />
        </View>
      </View> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Light grey background
  },
  heading: {
    fontSize: 31,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 70,
    color: '#333', // Darker text for better readability
  },
  content: {
    alignItems: 'center',
    width: '100%', // Ensure content uses full width
  },
  button: {
    backgroundColor: '#007bff', // Bootstrap primary blue
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center', // Center button text
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff', // White text color
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 10,
    width: '100%',
  },
  navText: {
    fontSize: 12,
  },
  navButtons: {
    flexDirection: 'row',
  },
  navButton: {
    marginLeft: 10, // Space out buttons
  },
  navButtonText: {
    color: '#007bff', // Match button colors for consistency
  },
});

export default Home;
