// app/Home.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello, World!</Text>
      <Button
        title="Access Files"
        onPress={() => navigation.navigate('Files')}
      />
      <Button
        title="Start Scanning"
        onPress={() => navigation.navigate('Scanning')}
      />
    </View>
  );
};

export default Home;





