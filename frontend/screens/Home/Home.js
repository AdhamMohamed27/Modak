import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, Button, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './HomeStyles';
import { useUser } from '../../../context/UserContext';
import { Linking } from 'react-native';
import handleFacialRecognition from '../../../backend/FacialRecognition';

const Home = ({ navigation }) => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(user);
  const [emotion, setEmotion] = useState(null);

  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading

  const CLIENT_ID = 'a2f91ce94fde4bc19cc377d3d32b70cc';
  const REDIRECT_URI = 'exp://10.40.35.21:8081/--/spotify-callback';
  const SPOTIFY_CLIENT_SECRET = 'a8df82269c244f54974b1e8a0c48d5cf';

  // State to control the modal visibility and store the selected mood
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');



  useEffect(() => {
    const handleRedirect = (event) => {
      const url = event.url;
      if (url.includes('code=')) {
        const code = url.split('code=')[1];
        if (code) {
          fetchAccessToken(code);
        }
      }
    };

    const listener = Linking.addEventListener('url', handleRedirect);
    return () => listener.remove();
  }, []);

  const handleSpotifyLogin = async () => {
    try {
      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-modify-public playlist-modify-private`;
      await Linking.openURL(authUrl);
    } catch (err) {
      console.error("Error during login:", err);
      Alert.alert("Error", "Unable to initiate Spotify login.");
    }
  };

  const fetchAccessToken = async (code) => {
    try {
      const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`;

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });

      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
          },
        });

        const userData = await userResponse.json();
        if (userData.id) {
          setUserId(userData.id);
        } else {
          console.error('Error fetching user ID:', userData);
        }
      } else {
        console.error('Error fetching access token:', data);
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const handleRandomPlaylist = async () => {
    if (!accessToken || !userId) {
      Alert.alert("Error", "Access token or user ID is missing.");
      return;
    }
    setLoading(true); // Set loading to true before the API call

    try {
      const response = await fetch("http://10.40.35.21:5000/create_playlist", {
        method: "POST",
        body: JSON.stringify({
          access_token: accessToken,
          user_id: userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      if (responseText.startsWith("{") || responseText.startsWith("[")) {
        try {
          const data = JSON.parse(responseText);

          if (data.url) {
            await Linking.openURL(data.url);
          } else {
            Alert.alert("Error", "Playlist URL not received.");
          }
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
      } else {
        Alert.alert("Error", "Invalid response received.");
      }

    } catch (error) {
      console.error("Error fetching playlist:", error);
      Alert.alert("Error", "Unable to generate random playlist.");
    }
    finally {
          setLoading(false); // Set loading to false after the API call
          }
  };

  const handleMoodPlaylist = async (mood) => {
    setLoading(true); // Set loading to true before the API call
    try {
      const response = await fetch("http://10.40.35.21:5000/generate-mood-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          mood,
          access_token: accessToken,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate playlist. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        await Linking.openURL(data.url);
      } else {
        Alert.alert("Error", "Mood playlist URL not received.");
      }
    } catch (error) {
      Alert.alert("Error", `Unable to generate mood playlist. ${error.message}`);
      console.error("Error generating playlist:", error);
    }
    finally {
          setLoading(false); // Set loading to false after the API call
          }
  };

  // Open and close modal
  const openMoodModal = () => {
    setModalVisible(true);
  };

  const closeMoodModal = () => {
    setModalVisible(false);
  };

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
    closeMoodModal();
    handleMoodPlaylist(mood);
  };

   const handleFacialRecognitionAndMood = async () => {
     setLoading(true); // Set loading to true before the facial recognition call
     try {
       // Call the facial recognition function and get the detected emotion
       detectedEmotion = await handleFacialRecognition('http://10.40.35.21:5001/detect_emotion');
        console.log("Detected Emotion", detectedEmotion);
       // If an emotion was detected, call handleMoodPlaylist with that emotion

       if (detectedEmotion) {
        if(detectedEmotion == 'angry')
          detectedEmotion = 'energetic';
        else if(detectedEmotion == 'neutral' || detectedEmotion == 'fear' || detectedEmotion == 'disgust' || detectedEmotion == 'surprise')
          detectedEmotion = 'relaxed';

         handleMoodPlaylist(detectedEmotion);
       } else {
         Alert.alert("Error", "No emotion detected.");
       }
     } catch (error) {
       console.error("Error during facial recognition and mood selection:", error);
       Alert.alert("Error", "Unable to detect emotion.");
     }
     finally {
           setLoading(false); // Set loading to false after the facial recognition call
         }

   };


  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: userProfile.profilePic || 'https://via.placeholder.com/50' }}
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

      {/* Spotify Circle */}
            <View style={styles.spotifyContainer}>
              <View style={styles.spotifyCircle}>
                <TouchableOpacity onPress={handleSpotifyLogin}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#008B8B" />
                  ) : (
                    <Image source={require('../../assets/spotify.png')} style={styles.spotifyLogo} />
                  )}
                </TouchableOpacity>
              </View>
            </View>


      {/* Bottom Playlist Boxes */}
      <View style={styles.playlistBoxes}>
        <TouchableOpacity style={styles.playlistBox} onPress={handleRandomPlaylist}>
          <Ionicons name="shuffle" size={30} color="#FFFFFF" />
          <Text style={styles.boxText}>Random</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playlistBox} onPress={openMoodModal}>
          <MaterialIcons name="mood" size={30} color="#FFFFFF" />
          <Text style={styles.boxText}>Mood</Text>
        </TouchableOpacity>
      </View>

      {/* Mood Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeMoodModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Mood</Text>
            {['happy', 'sad', 'energetic', 'relaxed'].map((mood) => (
              <TouchableOpacity
                key={mood}
                style={styles.moodButton}
                onPress={() => handleMoodSelection(mood)}>
                <Text style={styles.moodButtonText}>{mood}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={closeMoodModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <View style={{ position: 'relative' }}>
          <Ionicons name="home-outline" size={25} color="#008B8B" style={{ position: 'absolute', top: 0, left: 0 }} />
          <Ionicons name="home-outline" size={24} color="#008B8B" />
        </View>
          <Text style={[styles.navText, { fontWeight: 'bold' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleFacialRecognitionAndMood()}>
          <MaterialIcons name="face" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Emotion Detection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Social', {userId, accessToken})}>
          <Ionicons name="people-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Social</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;



