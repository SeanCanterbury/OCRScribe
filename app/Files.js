import React, { useEffect, useState } from 'react';
import { Share, View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import IP from '../assets/assets.js'

//FINAL
const uploadFile = async (uri) => {
  const url = 'http://' + IP + ':5001/upload'; 
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];
  let formData = new FormData();

  let file = {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  };

  formData.append('file', file);
  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    let response = await fetch(url, options);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
};

//FINAL
const fetchImages = async (setImages) => {
  try {
    const response = await fetch('http://' + IP + ':5001/files');
    const data = await response.json();

    const imageUrls = data.files.map(filename => 'http://' + IP + ':5001/uploads/' + filename);
    setImages(imageUrls);
    //console.log("Images: ", imageUrls);
  } catch (error) {
    console.error('Error fetching files:', error);
  }
};

const Files = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    fetchImages(setImages);
  }, []);

  //FINAL
  const translateImage = async (filename) => {
    const url = 'http://' + IP + ':5001/translate';
    //console.log("name: " + filename)
    let options = {
      method: 'POST',
      body: JSON.stringify({ filename }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    try {
      let response = await fetch(url, options);
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };


  //FINAL
  const getTranslation = async () => {
    try{
      if(selectedImageIndex != null) {
        filename = images[selectedImageIndex].split('/').pop();
        filename = filename.replace('.', '_'); // Corrected line
        filename = filename + '.txt';
        console.log("filename: " + filename);
        
        const url = 'http://' + IP + ':5001/translations/' + filename;

        let options = {
          method: 'GET',
          headers: {
           'Content-Type': 'application/json',
          },
        };

        try {
          let response = await fetch(url, options);
          let responseJson = await response.json();
          console.log("responseJson: '" + responseJson.translation + "'");
          if (responseJson.translation === '') {
            setTranslation("no text found");
          } else {
            setTranslation(responseJson.translation);
          }
          return responseJson.translation;
        }
        catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
    console.error(error);
    }
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        console.log(result.assets[0].uri);
        uploadFile(result.assets[0].uri);
        setImages(prevImages => [...prevImages, result.assets[0].uri]);
      } else {
        console.log('Image selection canceled or URI is undefined.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const deleteImage = () => {
    console.log("Hello world");
    console.log("sttored value: " + images[selectedImageIndex].split('/').pop());
    imgfilename = images[selectedImageIndex].split('/').pop();
    console.log("filename: " + imgfilename);
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
            () => setModalVisible(false);
            fetch(`http://${IP}:5001/delete/${imgfilename}`, {
              method: 'DELETE'
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to delete image');
              }
              return response.json();
            })
            .then(data => {
              console.log(data.message);
              const newImages = images.filter(url => url !== `http://${IP}:5001/uploads/${imgfilename}`);
              setImages(newImages);
              setModalVisible(false);
            })
            .catch(error => {
              console.error('Error deleting image:', error);
            });
          },
          style: 'destructive'
        }
      ]
    );
    fetchImages(setImages);
  };
  
  const shareImage = async () => {
    console.log("Imageurl: " + images[selectedImageIndex]);
    
      try{
        const result = await Share.share({
          message: images[selectedImageIndex],
        });
      } catch (error) {
        console.error("error sharing image: ", error);
      }
    
  }

  //FINAL
const scanImage = async() => {
  //console.log(`Scanning image at index ${selectedImageIndex}`);
  const selectedImageUrl = images[selectedImageIndex];
  //console.log(selectedImageUrl);
  const url = new URL(selectedImageUrl);
  const selectedImageFilename = url.pathname.split('/').pop();
  //console.log(selectedImageFilename);

  const response = await translateImage(selectedImageFilename);

  console.log(response.text);
  setModalVisible(false);
  navigation.navigate("Files");
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
          <Text> </Text>
          {selectedImageIndex !== null && (
            <Image source={{ uri: images[selectedImageIndex] }} style={styles.modalImage} />
          )}
            <View style={styles.textBox} onload={getTranslation()}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                <Text selectable={true} style={styles.translatedText}>
                {translation}
                </Text>
              </ScrollView>
            </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteImage}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={scanImage}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={shareImage}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
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
    paddingTop: 20,
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
  scrollView: {
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  textBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 0.9 * Dimensions.get('window').width,
    maxHeight: 0.25 * Dimensions.get('window').height,
    maxWidth: 0.9 * Dimensions.get('window').width,
    flexGrow: 1,
  },
  closeModalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  translatedText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Files;
