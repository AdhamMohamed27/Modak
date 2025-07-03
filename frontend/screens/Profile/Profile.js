import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext'; // Import useUser hook
import styles from './ProfileStyle';

const Profile = ({ navigation }) => {
  const { user } = useUser(); // Access user data from context
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Fetch user data from the context
    if (user) {
      setUserProfile(user);
    }
  }, [user]); // Only update when user data changes

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Profile Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')} // Navigate to EditProfile screen
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userProfile.profilePic || 'https://via.placeholder.com/100' }}
          style={styles.profilePicture}
        />
        <Text style={styles.userName}>{userProfile.username}</Text>
        <Text style={styles.userDetails}>Email: {userProfile.email}</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="stats-chart-outline" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Recent Moods</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Mood Diary</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
