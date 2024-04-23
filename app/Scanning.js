import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import IP from '../assets/assets.js';
import { useNavigation } from '@react-navigation/native';


const uploadFile = async (uri) => {

  const url = 'http://' + IP + ':5001/upload'; // Replace with your server UR

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

const Scanning = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoUri, setPhotoUri] = useState(null); // State to store the captured photo URI
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri); // Save the photo URI
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const retakePicture = () => {
    setPhotoUri(null); // Reset the photoUri state to retake photo
  };

  const usePhoto = () => {
    console.log('Photo selected:', photoUri);
    uploadFile(photoUri);
    navigation.navigate('Home');
  };

  // Render camera UI or a message if there's no access to the camera
  
  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>; 
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }


  // Render the camera preview or the captured photo
  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <Button title="Retake" onPress={retakePicture} style={styles.button}/>
          <Button title="Use Photo" onPress={usePhoto} style={styles.button}/>
        </View>
      ) : (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <TouchableOpacity style={styles.flipButton} onPress={() => setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          )}>
            <Text style={styles.flipText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.innerCircle} />
          </TouchableOpacity>
        </Camera>
      )}
    </View>
  );
};


//Style sheet for camera layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  flipButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 20,
  },
  flipText: {
    color: '#000000',
    fontSize: 18,
  },
  captureButton: {
    alignSelf: 'center',
    marginBottom: 50,
    width: 100,
    height: 100,
    borderRadius: 255,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 85,
    height: 85,
    borderRadius: 100,
    backgroundColor: 'black',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 20,
    marginTop: 20,
  },
});

export default Scanning;
