// ForgotPasswordStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1C1C1C', // Dark grey/blue background to match Login page
    },
    logo: {
        width: 150, // Adjust logo size to match login screen
        height: 150, // Adjust logo size
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#008B8B', // Consistent blue color for titles
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    instructions: {
        fontSize: 16,
        color: '#D1D1D1', // Light gray for instructions
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#008B8B', // Blue border to match the theme
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#008B8B', // Blue button to match the login theme
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
        color: '#008B8B', // Blue color for the link
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

export default styles;
