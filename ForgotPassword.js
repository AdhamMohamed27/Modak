// ForgotPassword.js
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({}); // State for error tracking

    const handleResetPassword = () => {
        const newErrors = {};

        // Validation checks
        if (email === '') newErrors.email = 'Email is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission
        }

        // Clear errors and show success
        setErrors({});
        // Logic to handle password reset request could go here
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://example.com/your-image.png' }} // Replace with your image URL
                style={styles.logo}
            />
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.instructions}>Please enter your email address below to reset your password.</Text>
            <View style={[styles.inputContainer, errors.email && styles.errorInput]}>
                <Ionicons name="mail-outline" size={24} color="#FF5733" />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => { setEmail(text); setErrors({...errors, email: null}); }}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footer}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#333333',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    instructions: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#FF5733',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    errorInput: {
        borderColor: 'red', // Red border for error highlight
    },
    input: {
        height: 50,
        flex: 1,
        color: '#333333',
        paddingLeft: 10,
    },
    button: {
        backgroundColor: '#FF5733',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 10,
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        marginTop: 20,
        color: '#007BFF',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ForgotPassword;
