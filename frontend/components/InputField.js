import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({
    icon,
    value,
    placeholder,
    onChangeText,
    secureTextEntry,
    error,
    showPasswordToggle,
    showPassword,
    setShowPassword,
}) => {
    return (
        <View style={[styles.inputContainer, error && styles.errorInput]}>
            <Ionicons name={icon} size={24} color="#008B8B" />
            <TextInput
                style={styles.input}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#B0B0B0"
            />
            {showPasswordToggle && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="#008B8B"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#008B8B',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    errorInput: {
        borderColor: 'red',
    },
    input: {
        flex: 1,
        height: 50,
        paddingLeft: 10,
        color: '#333333',
    },
});

export default InputField;
