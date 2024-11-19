import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Notifications = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <Text style={styles.settingOption}>Enable Push Notifications</Text>
      <Text style={styles.settingOption}>Manage Email Notifications</Text>
      <Text style={styles.settingOption}>Mute Notifications</Text>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back to Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingOption: {
    fontSize: 18,
    color: '#CCCCCC',
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: '#008B8B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 30,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Notifications;
