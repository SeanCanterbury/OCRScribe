// app/Index.js
import React from 'react';
import { View, Button } from 'react-native';

const Index = ({ navigation }) => {
  const handleEnterPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Enter" onPress={handleEnterPress} />
    </View>
  );
};

export default Index;
