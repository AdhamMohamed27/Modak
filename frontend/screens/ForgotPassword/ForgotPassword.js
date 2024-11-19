import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import InputField from '../../components/InputField'; // Importing InputField component
import SubmitButton from '../../components/Button'; // Importing SubmitButton component
import ErrorText from '../../components/ErrorText'; // Importing ErrorText component
import styles from './ForgotPasswordStyles'; // Import styles

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({}); // State for error tracking

    const handleResetPassword = () => {
        const newErrors = {};

        // Validation checks
        if (email === '') newErrors.email = 'Email is required';

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission if there are errors
        }

        // Clear errors and show success (you can integrate password reset logic here)
        setErrors({});
        alert('Password reset link has been sent to your email!');
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.instructions}>
                Please enter your email address below to reset your password.
            </Text>


            <InputField
                label="Email"
                icon="mail-outline"
                value={email}
                onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: null }); }}
                placeholder="Email"
                keyboardType="email-address"
                error={errors.email}
            />
            {errors.email && <ErrorText message={errors.email} />}


            <SubmitButton title="Send Reset Link" onPress={handleResetPassword} />


            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footer}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPassword;
