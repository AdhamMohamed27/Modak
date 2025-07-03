
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import styles from './styles'; // Import the shared styles

const SelectMood = ({ navigation }) => {
  const moods = [
    { name: 'Happy', moodKey: 'happy' },
    { name: 'Sad', moodKey: 'sad' },
    { name: 'Energetic', moodKey: 'energetic' },
    { name: 'Relaxed', moodKey: 'relaxed' },
  ];

  const handleMoodSelect = (mood) => {
    Alert.alert('Mood Selected', `You selected: ${mood}`, [
      { text: 'OK', onPress: () => console.log(`${mood} selected`) },
    ]);
    navigation.navigate('MoodPlaylist', { mood });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={[styles.userName, { fontSize: 24 }]}>Select Your Mood</Text>
      </View>

      {/* Mood Options */}
      <View style={styles.playlistBoxes}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.moodKey}
            style={styles.playlistBox}
            onPress={() => handleMoodSelect(mood.moodKey)}
          >
            <Text style={styles.boxText}>{mood.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Bar (Optional Navigation) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectMood;
