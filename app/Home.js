// app/Home.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to OCRScribe!</Text>
      {/* Content */}
      <View style={styles.content}>
        {/* Main content */}
        <View style={styles.buttonContainer}>
          <Button
            title="Access Files"
            onPress={() => navigation.navigate('Files')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Start Scanning"
            onPress={() => navigation.navigate('Scanning')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Edit Profile"
            onPress={() => {}}
          />
        </View>
      </View>
      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>
        <Text style={styles.navText}>© OCRScribe 2024</Text>
        <View style={styles.navButtons}>
          <Button title="Help" onPress={() => {}} />
          <Button title="Settings" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 10,
    width: '100%',
  },
  navText: {
    fontSize: 12,
  },
  navButtons: {
    flexDirection: 'row',
  },
});

export default Home;
