import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import IP from '../assets/assets.js'
//import uploadFile from '../assets/connectors.js';

const uploadFile = async (uri) => {
  const url = 'http://' + IP + ':5001/upload'; // Replace with your server URL

  // Get the file name and type from the URI
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  // Create a new form data
  let formData = new FormData();

  // Append the file to form data
  let file = {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  };

  formData.append('file', file);

  // Options for the fetch request
  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  // Make the request
  try {
    let response = await fetch(url, options);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
};


const Files = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);

  //preloads images const with the existing files in the server.
  useEffect(() => {
    console.log('http://' + IP + ':5001/files')
    fetch('http://' + IP + ':5001/files')
      .then(response => response.json())
      .then(data => {
        // Map the file names to URLs
        const imageUrls = data.files.map(filename => 'http://' + IP + ':5001/uploads/' + filename);
        setImages(imageUrls);
        console.log("Images: ", imageUrls)
      })
      .catch(error => {
        console.log(error);
        console.error('Error fetching files:', error);
      });
  }, []);
  
  /*
  const getHello = async () => {
    try {  
      const response = await fetch('http://' + IP + ':5001/helloworld');
      console.log("Getting hello2");
      const json = await response.json();
      console.log(json.message);
      
    } catch (error) {
      console.error(error);
    } 
  };
  
  useEffect(() => {
    getHello();
  }, []);
  */

  const translateImage = async (filename) => {
    const url = 'http://' + IP + ':5001/translate'; // Replace with your server URL
  
    // Options for the fetch request
    let options = {
      method: 'POST',
      body: JSON.stringify({ filename }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    // Make the request
    try {
      let response = await fetch(url, options);
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };



  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Updated to use index
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Fixed method name
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("testing");
      if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
        //setImages(prevImages => [...prevImages, result.assets[0].uri]);
        console.log(result.assets[0].uri);
        uploadFile(result.assets[0].uri);
      } else {
        console.log('Image selection canceled or URI is undefined.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const deleteImage = () => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            const newImages = [...images];
            newImages.splice(selectedImageIndex, 1); // Use index to delete
            setImages(newImages);
            setModalVisible(false); // Close modal after delete
          },
          style: 'destructive'
        }
      ]
    );
  };


//not working yet
const scanImage = async() => {
  console.log(`Scanning image at index ${selectedImageIndex}`);
  const selectedImageUrl = images[selectedImageIndex];
  console.log(selectedImageUrl);

  // Extract the filename from the URL
  const url = new URL(selectedImageUrl);
  const selectedImageFilename = url.pathname.split('/').pop();

  console.log(selectedImageFilename);

  const response = await translateImage(selectedImageFilename);

  console.log(response.text);
  setModalVisible(false);
};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Uploaded Images:</Text>
      <FlatList
        data={images}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.imageContainer} onPress={() => { setSelectedImageIndex(index); setModalVisible(true); }}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.imageList}
      />
      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          {selectedImageIndex !== null && (
            <Image source={{ uri: images[selectedImageIndex] }} style={styles.modalImage} />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteImage}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={scanImage}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Add your existing styles


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 25
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageList: {
    alignItems: 'center',
  },
  imageContainer: {
    margin: 5,
    position: 'relative',
  },
  image: {
    width: Dimensions.get('window').width / 3 - 10,
    height: Dimensions.get('window').width / 3 - 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});

export default Files;
