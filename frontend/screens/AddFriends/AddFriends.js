import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import DatabaseCommunicator from '../../../backend/DatabaseCommunicator';
import { useUser } from '../../../context/UserContext'; // Import the custom hook for user context
import styles from './AddFriendsStyles.js';

const AddFriends = ({ navigation }) => {
  const { user } = useUser(); // Access the user from context
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [failedRequests, setFailedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestExistsStatus, setRequestExistsStatus] = useState({});
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await DatabaseCommunicator.getAllUsers();
        setUsers(allUsers);

        const friendsList = await DatabaseCommunicator.getFriends(user.id);
        setFriends(friendsList);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user?.id]); // Fetch data whenever user.id changes

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter((userItem) => {
        const userName = userItem.username || '';
        return (
          userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          userItem.id !== user.id &&
          !friends.some(friend => friend.id === userItem.id)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users, friends, user?.id]); // Dependencies include user.id

  const checkRequestStatus = (receiverId) => {
    if (sentRequests.includes(receiverId)) {
      return 'sent';
    } else if (failedRequests.includes(receiverId)) {
      return 'failed';
    } else if (requestExistsStatus[receiverId] === true) {
      return 'exists';
    } else {
      return 'none';
    }
  };

  const handleAddFriend = async (receiverId) => {
    if (loading) return;

    setLoading(true);

    try {
      const requestExists = await DatabaseCommunicator.checkFriendRequestExists(user.id, receiverId);
      setRequestExistsStatus((prevStatus) => ({
        ...prevStatus,
        [receiverId]: requestExists
      }));

      if (requestExists) {
        return;
      }

      const result = await DatabaseCommunicator.sendFriendRequest(user.id, receiverId);
      if (result.success) {
        setSentRequests([...sentRequests, receiverId]);
        setTimeout(() => {
          setLoading(false);
        }, 10000);
      } else {
        setFailedRequests([...failedRequests, receiverId]);
      }
    } catch (error) {
      setFailedRequests([...failedRequests, receiverId]);
      console.error('Error sending friend request:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={24} color="#B0B0B0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search for users"
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <Text style={styles.title}>Search Results</Text>

      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => {
            const requestStatus = checkRequestStatus(item.id);

            return (
              <View style={styles.friendItem}>
                <View style={styles.profileContainer}>
                  <Image source={{ uri: item.profile_pic }} style={styles.profilePic} />
                  <Text style={styles.friendText}>{item.username}</Text>
                </View>

                {requestStatus === 'sent' ? (
                  <AntDesign name="checkcircle" size={24} color="#008B8B" />
                ) : requestStatus === 'failed' ? (
                  <AntDesign name="closecircle" size={24} color="#008B8B" />
                ) : requestStatus === 'exists' ? (
                  <View style={styles.alreadySentBox}>
                    <Text style={styles.alreadySentBoxText}>Request Already Sent</Text>
                  </View>
                ) : requestStatus === 'none' ? (
                  <TouchableOpacity
                    onPress={() => handleAddFriend(item.id)}
                    style={[styles.addFriendButton, loading && styles.disabledButton]}
                    disabled={loading}
                  >
                    <Text style={styles.addFriendButtonText}>
                      {loading ? 'Sending...' : 'Add Friend'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        searchQuery !== '' && (
          <Text style={styles.noResultsText}>No users found for "{searchQuery}"</Text>
        )
      )}
    </View>
  );
};

export default AddFriends;
