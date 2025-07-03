// FacialRecognition.js
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const handleFacialRecognition = async (apiUrl) => {
  console.log("Facial recognition button pressed");

  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  console.log('Camera permission result:', permissionResult);

  if (!permissionResult.granted) {
    console.error('Camera permissions denied');
    return null;
  }

  const response = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  console.log('ImagePicker response:', response);

  if (!response.canceled && response.assets && response.assets[0]?.uri) {
    const imageUri = response.assets[0].uri;
    console.log('Captured photo URI:', imageUri);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      console.log(`Sending image to the API (${apiUrl}) for emotion detection...`);
      const result = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('API Response:', result.data);

      return result.data.emotion; // Return the emotion from the API response

    } catch (error) {
      console.error('Error during API request:', error.response || error.message || error);
      return null; // Return null if error occurs
    }
  } else {
    console.log('Camera launch canceled or no image captured');
    return null; // Return null if no image was captured
  }
};

export default handleFacialRecognition;
