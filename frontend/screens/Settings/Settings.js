import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the back arrow
import styles from './SettingsStyle'; // Import the profile style

const Settings = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Perform any necessary cleanup, like clearing stored user data or tokens
    console.log('User logged out');

    // Redirect to the login page
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], 
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      {/* Navigation buttons for each settings category */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PrivacyAndSecurity')}
      >
        <Text style={styles.buttonText}>Privacy & Security</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AccountSettings')}
      >
        <Text style={styles.buttonText}>Account Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Text style={styles.buttonText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AppPreferences')}
      >
        <Text style={styles.buttonText}>App Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HelpAndSupport')}
      >
        <Text style={styles.buttonText}>Help & Support</Text>
      </TouchableOpacity>

      {/* Logout button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout} // Call handleLogout when pressed
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
