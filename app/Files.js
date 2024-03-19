// app/Files.js
import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Files = () => {
  const navigation = useNavigation();
  const [files, setFiles] = useState([]); // State to store uploaded files

  // Function to handle file upload
  const handleFileUpload = () => {
    // Logic to upload file goes here
    console.log('File uploaded');
    // For demonstration, adding a dummy file to the list
    setFiles([...files, { id: files.length + 1, name: `File ${files.length + 1}` }]);
  };

  // Function to render each file item in the list
  const renderFileItem = ({ item }) => (
    <TouchableOpacity onPress={() => console.log(`File selected: ${item.name}`)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Upload Files</Text>
      <Button title="Upload File" onPress={handleFileUpload} />
      <Text>Uploaded Files:</Text>
      <FlatList
        data={files}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Files;
