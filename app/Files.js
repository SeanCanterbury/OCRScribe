import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const Files = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable editing for simplicity
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const renderImageItem = ({ item }) => (
    <TouchableOpacity onPress={() => console.log(`Image selected: ${item}`)}>
      <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Upload Images</Text>
      <Button title="Upload Image" onPress={pickImage} />
      <Text>Uploaded Images:</Text>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Files;
