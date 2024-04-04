import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import IP from '../assets/assets.js';

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

const Scanning = () => {
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
    // Here you can handle the photo URI (e.g., upload it or pass it to another component)
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
          <Button title="Retake" onPress={retakePicture} />
          <Button title="Use Photo" onPress={usePhoto} />
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
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
  },
  flipText: {
    color: '#fff',
    fontSize: 18,
  },
  captureButton: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
  },
});

export default Scanning;
