import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, RefreshControl } from 'react-native';
import DatabaseCommunicator from '../../../backend/DatabaseCommunicator';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext'; // Import the useUser hook
import handleFacialRecognition from '../../../backend/FacialRecognition'; // Import the function
import styles from './SocialStyles';

const Social = ({ navigation }) => {
  const { user } = useUser(); // Access the user data from context
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [emotion, setEmotion] = useState(null); // State to store detected emotion
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  // Fetch data from the database
  const fetchData = async () => {
    try {
      const requests = await DatabaseCommunicator.getFriendRequests(user.id);
      setFriendRequests(requests);

      const friendData = await DatabaseCommunicator.getFriends(user.id);
      setFriends(friendData);
      setFilteredFriends(friendData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setRefreshing(false); // Stop the refresh spinner once data is fetched
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]); // Fetch data whenever the user context changes

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  // Handle the pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true); // Start the refresh spinner
    fetchData(); // Fetch the latest data
  };

  return (
    <View style={styles.container}>
      {/* Main content */}
      <Text style={styles.pageLabel}>Social</Text>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={24} color="#B0B0B0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.addFriendsButton} onPress={() => navigation.navigate('AddFriends')}>
        <MaterialIcons name="person-add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.requestsContainer}>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => navigation.navigate('Requests')}
        >
          <Text style={styles.requestButtonText}>Friend Requests ({friendRequests.length})</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Your Friends</Text>

      {/* FlatList with pull-to-refresh at the top */}
      <FlatList
        data={filteredFriends}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Image source={{ uri: item.profile_pic }} style={styles.profilePic} />
            <Text style={styles.friendText}>{item.username}</Text>
          </View>
        )}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#008B8B" // Set the color of the loading spinner
          />
        }
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleFacialRecognition('http://192.168.1.15:5000/detect_emotion', navigation, setEmotion)} // Call the function
        >
          <MaterialIcons name="face" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Emotion Detection</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (navigation.isFocused()) {
              console.log('Already on Social screen');
              return;
            }
            navigation.navigate('Social');
          }}
        >
          <View style={{ position: 'relative' }}>
            <Ionicons name="people-outline" size={25} color="#008B8B" style={{ position: 'absolute', top: 0, left: 0 }} />
            <Ionicons name="people-outline" size={24} color="#008B8B" />
          </View>
          <Text style={[styles.navText, { fontWeight: 'bold' }]}>Social</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Social;
