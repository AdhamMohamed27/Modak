// Emotion.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Emotion = ({ route }) => {
  const { emotion } = route.params; // Retrieve emotion from the navigation parameters

  return (
    <View style={styles.container}>
      <Text style={styles.emotionText}>Detected Emotion: {emotion}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  emotionText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Emotion;
