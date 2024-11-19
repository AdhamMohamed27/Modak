import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SubmitButton = ({ title, onPress, disabled }) => (
    <TouchableOpacity
        style={[styles.button, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        width: '40%',
        height: 50,
        backgroundColor: '#008B8B',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#A9A9A9',
    },
});

export default SubmitButton;
