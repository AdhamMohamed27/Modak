import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { supabase } from './supabaseClient';

const Registration = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSignUp = async () => {
        const newErrors = {};

        // Validation checks
        if (username === '') newErrors.username = 'Username is required';
        if (email === '') newErrors.email = 'Email is required';

        // Check if the email is in the correct format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (password === '') newErrors.password = 'Password is required';
        if (confirmPassword === '') newErrors.confirmPassword = 'Confirmation is required';

        // Check if the password is at least 8 characters long
        if (password && password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission
        }

        try {
            // Check if the username already exists in the database
            const { data: usernameCheck, error: usernameError } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .single();

            if (usernameCheck) {
                newErrors.username = 'Username is already taken';
            }

            // Check if the email already exists in the database
            const { data: emailCheck, error: emailError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (emailCheck) {
                newErrors.email = 'Email is already taken';
            }

            // If there are any errors, set them and prevent sign-up
            if (newErrors.username || newErrors.email) {
                setErrors(newErrors);
                return;
            }

            // If no errors, insert the new user into the database
            const { error } = await supabase
                .from('users')
                .insert([{ username, email, password }]);

            if (error) {
                setErrors({ registration: error.message });
            } else {
                setErrors({});
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error("Registration error: ", error);
            setErrors({ registration: 'An error occurred. Please try again.' });
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('./Logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Sign Up for Modak</Text>
            <View style={[styles.inputContainer, errors.username && styles.errorInput]}>
                <Ionicons name="person-outline" size={24} color="#008B8B" />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) => { setUsername(text); setErrors({ ...errors, username: null }); }}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.username && <Text style={styles.errorMessage}>{errors.username}</Text>}

            <View style={[styles.inputContainer, errors.email && styles.errorInput]}>
                <Ionicons name="mail-outline" size={24} color="#008B8B" />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: null }); }}
                    placeholderTextColor="#B0B0B0"
                    keyboardType="email-address"
                />
            </View>
            {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}

            <View style={[styles.inputContainer, errors.password && styles.errorInput]}>
                <Ionicons name="lock-closed-outline" size={24} color="#008B8B" />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: null }); }}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}

            <View style={[styles.inputContainer, errors.confirmPassword && styles.errorInput]}>
                <Ionicons name="lock-closed-outline" size={24} color="#008B8B" />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: null }); }}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#B0B0B0"
                />
            </View>
            {errors.confirmPassword && <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>}
            {errors.registration && <Text style={styles.errorMessage}>{errors.registration}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footer}>
                    Already have an account? <Text style={styles.footerLink}>Login</Text>
                </Text>
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
        backgroundColor: '#1C1C1C',
    },
    logo: {
        width: 150, // Adjust logo size
        height: 150, // Adjust logo size
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#008B8B',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#008B8B',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    errorInput: {
        borderColor: 'red',
    },
    input: {
        height: 50,
        flex: 1,
        color: '#333333',
        paddingLeft: 10,
    },
    button: {
        backgroundColor: '#008B8B',
        paddingVertical: 20,
        paddingHorizontal: 40,
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
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '600',
    },
    footerLink: {
        color: '#008B8B',
        fontWeight: 'bold',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Registration;
