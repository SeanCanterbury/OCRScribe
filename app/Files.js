import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

// Function to upload file
const uploadFile = async (uri, type, name) => {
  const url = 'http://127.0.0.1:5000/upload';

  // Create a new form data
  let formData = new FormData();

  // Append the file to form data
  let file = {
    uri,
    type,
    name,
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

  // Usage
  //uploadFile('file://path/to/file.jpg', 'image/jpeg', 'file.jpg');
};



const Files = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    fetch('http://YOUR-IP:5001/files')
      .then(response => response.json())
      .then(data => {console.log(data);
      })
      .catch(error => {
        console.log(error);
        console.error('Error fetching files:', error);
      });
  }, []);
  
  const getHello = async () => {
    try {
      console.log("Getting hello1");
  
      const response = await fetch('http://YOUR-IP:5001/helloworld');
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

      if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
        //setImages(prevImages => [...prevImages, result.assets[0].uri]);
        print(result.uri)
        uploadFile(result.uri, 'image/jpeg', 'uploaded_image.jpg');
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

  const scanImage = () => {
    console.log(`Scanning image at index ${selectedImageIndex}`);
    // Close modal after scan (for now)
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
