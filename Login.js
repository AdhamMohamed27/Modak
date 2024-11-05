import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { supabase } from './supabaseClient';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

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
                source={require('./Logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Log in to your account</Text>
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
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="#008B8B"
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
                <Text style={styles.footer}>
                    Don't have an account? <Text style={styles.footerLink}>Sign Up</Text>
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    forgotPassword: {
        color: '#008B8B',
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

export default Login;
