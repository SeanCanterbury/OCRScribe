// app/Files.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Files = () => {
  const navigation = useNavigation();

  // Example function to demonstrate navigation
  // Replace this with your actual function to handle file actions
  const handleFileAction = () => {
    console.log('File action');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Files Screen</Text>
      <Button
        title="Perform File Action"
        onPress={handleFileAction}
      />
    </View>
  );
};

export default Files;

