import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../app/Index';
import Home from '../app/Home';
import Files from '../app/Files';
import Scanning from '../app/Scanning';
import SignUp from '../app/SignUp'; // Import the SignUp component
import { TouchableOpacity, Text } from 'react-native';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Index" 
        component={Index} 
        options={{ headerShown: false }} />
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
        title: 'Home',
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('Index')} // Replace with signout functionality
          >
            <Text>Sign Out</Text>
          </TouchableOpacity>
        ),
      })}
    />
      <Stack.Screen 
        name="Files" 
        component={Files} 
        options={{ title: 'Files' }} />
      <Stack.Screen 
        name="Scanning" 
        component={Scanning} 
        options={{ title: 'Scanning' }} />
      <Stack.Screen 
        name="SignUp" // Add a screen for SignUp
        component={SignUp}
        options={{ title: 'Sign Up' }} />
    </Stack.Navigator>
  );
};

export default Navigation;
