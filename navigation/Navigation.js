import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../app/Index';
import Home from '../app/Home';
import Files from '../app/Files';
import Scanning from '../app/Scanning';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
      <Stack.Screen name="Files" component={Files} options={{ title: 'Files' }} />
      <Stack.Screen name="Scanning" component={Scanning} options={{ title: 'Scanning' }} />
    </Stack.Navigator>
  );
};

export default Navigation;