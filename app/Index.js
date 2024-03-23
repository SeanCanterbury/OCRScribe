import React from 'react';
import { View, Button, Text, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Index = () => {
  const navigation = useNavigation();

  const handleEnterPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.Header}>OCRScribe</Text>
      <Text>Scan handwritten documents into machine-readable text</Text>
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