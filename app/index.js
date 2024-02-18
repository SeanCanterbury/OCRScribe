import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';


const Home = () => {
    return (
        <View style={styles.container}>
          <Text style ={styles.Header}>OCRScribe</Text>
          <Text>Scan handwritten documents into machine readable text</Text>
          <StatusBar style="auto" />
        </View>
    );
}


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

export default Home;