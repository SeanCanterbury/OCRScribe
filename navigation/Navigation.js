import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../app/Index';
import Home from '../app/Home';
import Files from '../app/Files';
import Scanning from '../app/Scanning';
import SignUp from '../app/SignUp'; // Import the SignUp component
import ProfileSettings from '../app/ProfileSettings'; // Import the ProfileSettings component
import { TouchableOpacity, Text } from 'react-native';
import { useEffect, useState } from 'react';
import IP from '../assets/assets.js';


const Stack = createStackNavigator();



const Navigation = () => {

  const url = 'http://' + IP + ':5001/user';


  const handleSignoutPress = async () => {
    try {
      const response = await fetch('http://' + IP + ':5001/signout', {
      method: 'get',
    })

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
      } else {
        // Handle error response from server
        console.error('Error Signing Out');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
    
  };

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
          headerLeft: null, // Hide the back button
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: 'red',
                borderRadius: 5,
              }}
              onPress={() => { handleSignoutPress(); navigation.navigate("Index"); }}
            >
              <Text style={{ color: 'white' }}>Sign Out</Text>
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
      <Stack.Screen 
        name="ProfileSettings" 
        component={ProfileSettings} 
        options={{ title: 'Profile Settings' }} />

    </Stack.Navigator>
  );
};

export default Navigation;
