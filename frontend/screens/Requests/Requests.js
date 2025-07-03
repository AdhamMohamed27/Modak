import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../../../context/UserContext'; // Custom hook for user context
import DatabaseCommunicator from '../../../backend/DatabaseCommunicator';
import styles from './RequestsStyles';

const Requests = ({ navigation }) => {
  const { user } = useUser(); // Access the user data from context
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [refreshing, setRefreshing] = useState(false); // Refresh state for pull-to-refresh

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const requests = await DatabaseCommunicator.getFriendRequests(user.id);
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error fetching friend requests:', error.message);
    } finally {
      setLoading(false); // Ensure loading spinner stops after fetching data
      setRefreshing(false); // Stop refreshing spinner
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFriendRequests();
    }
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFriendRequests();
  };

  const handleRequestResponse = async (requestId, accept) => {
    try {
      const result = await DatabaseCommunicator.respondToFriendRequest(requestId, accept);
      if (result.success) {
        setFriendRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
        console.log(`Request ${accept ? 'accepted' : 'denied'}`);
      } else {
        console.error('Failed to handle request:', result.message);
      }
    } catch (error) {
      console.error('Error responding to friend request:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#008B8B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Friend Requests</Text>

      {friendRequests.length === 0 ? (
        <View style={styles.noRequestsContainer}>
          <Text style={styles.noRequestsText}>No Friend Requests{'\n'}at the Moment</Text>
        </View>
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <View style={styles.senderInfo}>
                {item.sender ? (
                  <>
                    <Image source={{ uri: item.sender.profile_pic }} style={styles.profilePic} />
                    <Text style={styles.friendText}>{item.sender.username || 'Unknown User'}</Text>
                  </>
                ) : (
                  <Text style={styles.friendText}>Unknown User</Text>
                )}
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => handleRequestResponse(item.id, true)}
                  style={styles.acceptButton}
                >
                  <Text style={styles.acceptButtonText}>✔</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRequestResponse(item.id, false)}
                  style={styles.denyButton}
                >
                  <Text style={styles.denyButtonText}>✘</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#008B8B"
            />
          }
        />
      )}
    </View>
  );
};

export default Requests;
