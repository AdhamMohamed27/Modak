import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext'; // Import useUser hook
import styles from './EditProfileStyles';
import * as ImagePicker from 'expo-image-picker';
import DatabaseCommunicator from '../../../backend/DatabaseCommunicator'; // Import DatabaseCommunicator

const EditProfile = ({ navigation }) => {
  const { user, setUser } = useUser(); // Access user data from context
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const pickImage = async () => {
    console.log("Picking an image...");

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      console.log("Permission to access media library is denied");
      Alert.alert("Permission denied", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("Pick result:", result); // Log the entire result object

    if (!result.canceled) {
      console.log("Image picked successfully:", result.assets[0].uri);
      setProfilePic(result.assets[0].uri);
    } else {
      console.log("Image pick canceled");
    }
  };

  const saveProfile = async () => {
    console.log("Saving profile...");
    setLoading(true);
    setUsernameError('');
    setEmailError('');

    try {
      let profilePicUrl = profilePic;

      console.log("User ID:", user?.id); // Log user ID to debug
      if (!user?.id) {
        throw new Error("User ID is undefined. Cannot update profile.");
      }

      if (typeof profilePic === 'string' && profilePic.startsWith('file://')) {
        console.log("Uploading profile picture...");
        profilePicUrl = await DatabaseCommunicator.uploadProfilePicture(profilePic, user.id);
        console.log("Uploaded profile picture URL:", profilePicUrl); // Log the profilePicUrl after upload
      }

      if (!profilePicUrl) {
        throw new Error('Failed to upload profile picture');
      }

      console.log("Updating user profile with URL:", profilePicUrl); // Log the profilePicUrl before updating profile
      const updateResult = await DatabaseCommunicator.updateUserProfile(user.id, username, email, profilePicUrl);

      if (updateResult.success) {
        console.log("Profile updated successfully");
        setUser({ ...user, username, email, profilePic: profilePicUrl });
        navigation.goBack();
      } else {
        // Handle errors like username/email already taken
        if (updateResult.field === 'username') {
          setUsernameError(updateResult.message);
        } else if (updateResult.field === 'email') {
          setEmailError(updateResult.message);
        } else {
          Alert.alert('Error', 'Unable to save changes. Please try again.');
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: profilePic || 'https://via.placeholder.com/100' }}
            style={styles.profilePicture}
          />
          <Ionicons name="pencil" size={24} color="#FFFFFF" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={[styles.input, usernameError && styles.inputError]} // Apply red border if there's an error
          placeholder={user.username}
          placeholderTextColor="#999999"
          value={username}
          onChangeText={setUsername}
        />
        {usernameError ? <Text style={styles.errorMessage}>{usernameError}</Text> : null}

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]} // Apply red border if there's an error
          placeholder={user.email}
          placeholderTextColor="#999999"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}
      </View>

      <View style={styles.actionButtons}>
        {/* Save button with loading indicator */}
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionText}>Save</Text>
          )}
        </TouchableOpacity>

        {/* Cancel button */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.actionText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;
