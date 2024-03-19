import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation/Navigation';

const App = () => {
  return (
    <NavigationContainer>
      {/* Render your Navigation component */}
      <Navigation />
    </NavigationContainer>
  );
};

export default App;