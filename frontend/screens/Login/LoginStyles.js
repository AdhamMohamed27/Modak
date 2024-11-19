import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1C1C1C',
    },
    logo: {
        width: 150,
        height: 150,
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end', // Aligns the container to the right
        marginBottom: 10, // Space before Login button
    },
    forgotPassword: {
        fontSize: 15,
        color: '#008B8B',
        fontWeight: 'bold',
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

export default styles;
