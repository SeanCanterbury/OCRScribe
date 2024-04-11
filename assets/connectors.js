import IP from 'assets.js';

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