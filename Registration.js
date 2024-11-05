// Registration.js
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons

const Registration = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({}); // State for error tracking

    const handleSignUp = () => {
        const newErrors = {};

        // Validation checks
        if (username === '') newErrors.username = 'Username is required';
        if (email === '') newErrors.email = 'Email is required';
        if (password === '') newErrors.password = 'Password is required';
        if (confirmPassword === '') newErrors.confirmPassword = 'Confirmation is required';
        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission
        }

        // Clear errors and show success
        setErrors({});
        // Logic to send data to your backend could go here
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://example.com/your-registration-image.png' }} // Replace with your image
                style={styles.logo}
            />
            <Text style={styles.title}>Sign Up for Modak</Text>
            <View style={[styles.inputContainer, errors.username && styles.errorInput]}>
                <Ionicons name="person-outline" size={24} color="#FF5733" />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) => { setUsername(text); setErrors({...errors, username: null}); }}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.username && <Text style={styles.errorMessage}>{errors.username}</Text>}

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

            <View style={[styles.inputContainer, errors.password && styles.errorInput]}>
                <Ionicons name="lock-closed-outline" size={24} color="#FF5733" />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => { setPassword(text); setErrors({...errors, password: null}); }}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}

            <View style={[styles.inputContainer, errors.confirmPassword && styles.errorInput]}>
                <Ionicons name="lock-closed-outline" size={24} color="#FF5733" />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => { setConfirmPassword(text); setErrors({...errors, confirmPassword: null}); }}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.confirmPassword && <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footer}>Already have an account? Login</Text>
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
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#FF5733',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5, // Adjust margin to keep error message close to input
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
        marginBottom: 10, // Space between error message and next element
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Registration;
