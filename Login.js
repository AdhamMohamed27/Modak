import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { supabase } from './supabaseClient';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({}); // State for error tracking

    const handleLogin = async () => {
        const newErrors = {};

        // Validation checks
        if (username === '') newErrors.username = 'Username is required';
        if (password === '') newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, username, password')
                .eq('username', username)
                .single();

            if (error || !data || data.password !== password) {
                setErrors({ login: 'Invalid username or password' });
            } else {
                setErrors({});
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error("Login error: ", error);
            setErrors({ login: 'An error occurred. Please try again.' });
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://example.com/your-image.png' }} // Replace with your image URL
                style={styles.logo}
            />
            <Text style={styles.title}>Welcome to Modak</Text>
            <View style={[styles.inputContainer, errors.username && styles.errorInput]}>
                <Ionicons name="person-outline" size={24} color="#FF5733" />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) => { setUsername(text); setErrors({ ...errors, username: null }); }}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.username && <Text style={styles.errorMessage}>{errors.username}</Text>}

            <View style={[styles.inputContainer, errors.password && styles.errorInput]}>
                <Ionicons name="lock-closed-outline" size={24} color="#FF5733" />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: null }); }}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#B0B0B0"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="#FF5733"
                    />
                </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}
            {errors.login && <Text style={styles.errorMessage}>{errors.login}</Text>}

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.footer}>Don't have an account? Sign Up</Text>
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end', // Align the button to the right
        marginBottom: 10, // Space between the button and next element
    },
    forgotPassword: {
        color: '#007BFF', // Link color
        textDecorationLine: 'underline', // Underline text for clickable action
        fontWeight: '600',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10, // Space between error message and next element
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Login;
