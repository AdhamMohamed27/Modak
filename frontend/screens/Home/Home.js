import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import User from '../../../backend/User'; // Import the User class
import * as ImagePicker from 'expo-image-picker'; // For image picking (Expo compatible)
import axios from 'axios'; // For making API requests
import styles from './HomeStyles';


const Home = ({ navigation, route }) => {
  const { user } = route.params; // Get user data passed from the previous screen
  const [userProfile, setUserProfile] = useState(user);
  const [emotion, setEmotion] = useState(null); // State to store detected emotion

  // Log the initial user data
  useEffect(() => {
    console.log('Initial user data passed from route:', user);
  }, [user]);

  // Sample recommended tracks
  const recommendedTracks = [
    { id: '1', title: 'Track 1', artist: 'Artist A' },
    { id: '2', title: 'Track 2', artist: 'Artist B' },
    { id: '3', title: 'Track 3', artist: 'Artist C' },
  ];

  const renderTrackItem = ({ item }) => (
    <View style={styles.trackItem}>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play-circle-outline" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    if (!userProfile.profilePic) {
      const fetchUserData = async () => {
        console.log('Fetching user data from User.getInstance()...');
        const fullUserData = await User.getInstance(); // Assuming the User instance is initialized
        console.log('Fetched user data:', fullUserData);

        const profilePicUrl = fullUserData.profilePicUrl; // The URL from the database
        setUserProfile({ ...fullUserData, profilePic: profilePicUrl }); // Update state with the new data
      };
      fetchUserData();
    }
  }, [userProfile]);

  // Log the userProfile data whenever it changes
  useEffect(() => {
    console.log('Current userProfile:', userProfile);
  }, [userProfile]);

  // Trigger facial recognition
  const handleFacialRecognition = async () => {
    console.log("Facial recognition button pressed");

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Camera permission result:', permissionResult);

    if (!permissionResult.granted) {
      console.error('Camera permissions denied');
      return;
    }

    const response = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log('ImagePicker response:', response); // Log the whole response object

    if (!response.canceled && response.assets && response.assets[0]?.uri) {
      const imageUri = response.assets[0].uri; // Access the URI correctly
      console.log('Captured photo URI:', imageUri); // Log the URI of the captured photo

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg', // Correct MIME type
        name: 'photo.jpg',
      });

      try {
        const apiUrl = 'http://192.168.1.15:5000/detect_emotion'; // Replace with your API URL
        console.log(`Sending image to the API (${apiUrl}) for emotion detection...`);
        const result = await axios.post(apiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('API Response:', result.data);

        setEmotion(result.data.emotion); // Assuming the backend sends emotion in 'emotion'

        // Navigate to the emotion page after getting the emotion
        if (result.data.emotion) {
          navigation.navigate('Emotion', { emotion: result.data.emotion });
        }
      } catch (error) {
        console.error('Error during API request:', error.response || error.message || error);
      }
    } else {
      console.log('Camera launch canceled or no image captured');
    }
  };


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: userProfile.profilePic || 'https://via.placeholder.com/50' }} // Use the profile picture URL
            style={styles.profilePicture}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{userProfile.username}</Text>
          <Text style={styles.userDetails}>Your Favorite Tunes</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Recommended Tracks Section */}
      <View style={styles.recommendedSection}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <FlatList
          data={recommendedTracks}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Emotion Display */}
      {emotion && (
        <View style={styles.emotionContainer}>
          <Text style={styles.emotionText}>Detected Emotion: {emotion}</Text>
        </View>
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (navigation.isFocused()) {
              console.log('Already on Home screen');
              return;
            }
            navigation.navigate('Home');
          }}
        >
          <Ionicons name="home-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleFacialRecognition} // Trigger facial recognition
        >
          <MaterialIcons name="face" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Facial Recognition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('More')}
        >
          <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default Home;
