import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText'; // Import ErrorText
import DatabaseCommunicator from '../../../backend/DatabaseCommunicator'; // Import the database communicator
import styles from './RegistrationStyles';

const Registration = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSignUp = async () => {
        const newErrors = {};

        // Basic validation
        if (username === '') newErrors.username = 'Username is required';
        if (email === '') newErrors.email = 'Email is required';

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (password === '') newErrors.password = 'Password is required';
        if (confirmPassword === '') newErrors.confirmPassword = 'Confirmation is required';

        if (password && password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Call the registerUser method from the DatabaseCommunicator
        const result = await DatabaseCommunicator.registerUser(username, email, password);

        if (result.success) {
            Alert.alert('Success', 'Registration successful!');
            navigation.navigate('Login');
        } else {
            setErrors({ registration: result.message });
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>Sign Up for Modak</Text>

            <InputField
                icon="person-outline"
                value={username}
                placeholder="Username"
                onChangeText={(text) => { setUsername(text); setErrors({ ...errors, username: null }); }}
                error={errors.username}
            />
            {errors.username && <ErrorText message={errors.username} />}

            <InputField
                icon="mail-outline"
                value={email}
                placeholder="Email"
                onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: null }); }}
                error={errors.email}
            />
            {errors.email && <ErrorText message={errors.email} />}

            <InputField
                icon="lock-closed-outline"
                value={password}
                placeholder="Password"
                onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: null }); }}
                secureTextEntry={!showPassword}
                error={errors.password}
            />
            {errors.password && <ErrorText message={errors.password} />}

            <InputField
                icon="lock-closed-outline"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: null }); }}
                secureTextEntry={!showPassword}
                error={errors.confirmPassword}
            />
            {errors.confirmPassword && <ErrorText message={errors.confirmPassword} />}

            <Button title="Sign Up" onPress={handleSignUp} />

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footer}>Already have an account? <Text style={styles.footerLink}>Login</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

export default Registration;
