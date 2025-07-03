import { Linking, Alert } from 'react-native';

const CLIENT_ID = 'a2f91ce94fde4bc19cc377d3d32b70cc';
const REDIRECT_URI = 'exp://10.40.49.31:8081/--/spotify-callback';
const SPOTIFY_CLIENT_SECRET = 'a8df82269c244f54974b1e8a0c48d5cf';

export const handleSpotifyLogin = async () => {
  try {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-modify-public playlist-modify-private`;
    await Linking.openURL(authUrl);
  } catch (err) {
    console.error("Error during login:", err);
    Alert.alert("Error", "Unable to initiate Spotify login.");
  }
};

export const fetchAccessToken = async (code) => {
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
      return data.access_token;
    } else {
      console.error('Error fetching access token:', data);
      throw new Error('Failed to fetch access token');
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

export const fetchUserProfile = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const userData = await response.json();
    if (userData.id) {
      return userData;
    } else {
      console.error('Error fetching user ID:', userData);
      throw new Error('Failed to fetch user profile');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const handleRandomPlaylist = async (accessToken, userId) => {
  try {
    const response = await fetch("http://10.40.49.31:5000/create_playlist", {
      method: "POST",
      body: JSON.stringify({
        access_token: accessToken,
        user_id: userId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.url) {
      await Linking.openURL(data.url);
    } else {
      Alert.alert("Error", "Playlist URL not received.");
    }
  } catch (error) {
    console.error("Error fetching playlist:", error);
    Alert.alert("Error", "Unable to generate random playlist.");
    throw error;
  }
};

export const handleMoodPlaylist = async (mood, accessToken, userId) => {
  try {
    const response = await fetch("http://10.40.49.31:5000/generate-mood-playlist", {
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
    console.error("Error generating playlist:", error);
    Alert.alert("Error", `Unable to generate mood playlist. ${error.message}`);
    throw error;
  }
};
