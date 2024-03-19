import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../app/Index';
import Home from '../app/Home';
import Files from '../app/Files'; // Importing Files screen
import Scanning from '../app/Scanning'; // Importing Scanning screen, ensure the file is correctly named

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      {/* Stack Navigator with registered screens */}
      <Stack.Navigator>
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Files" component={Files} />
        <Stack.Screen name="Scanning" component={Scanning} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;