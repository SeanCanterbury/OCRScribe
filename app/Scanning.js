// app/Scanning.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Scanning = () => {
  const navigation = useNavigation();

  // Example function to demonstrate navigation
  // Replace this with your actual function for scanning
  const startScanning = () => {
    console.log('Start scanning');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Scanning Screen</Text>
      <Button
        title="Start Scanning"
        onPress={startScanning}
      />
    </View>
  );
};

export default Scanning;

