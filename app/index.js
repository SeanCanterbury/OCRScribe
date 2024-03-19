
// app/Index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button, Text, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Home from './Home';
import Files from './Files';
import Scanning from './Scanning';

const Stack = createStackNavigator();

const Index = () => {
  const navigation = useNavigation(); // useNavigation is recognized here

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

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Index" component={Index} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Files" component={Files} />
      <Stack.Screen name="Scanning" component={Scanning} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
