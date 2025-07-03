import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import DatabaseCommunicator from '../../../backend/DatabaseCommunicator'; // Import the database communicator
import User from '../../../backend/User'; // Import the User class
import styles from './LoginStyles';
import { useUser } from '../../../context/UserContext'; // Import useUser hook

const Login = ({ navigation }) => {
  const { setUser } = useUser(); // Access setUser from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch user data from the database if missing fields like email or profilePic
  const fetchAdditionalUserData = async (userId) => {
    try {
      const userDetails = await DatabaseCommunicator.getUserDetails(userId); // Fetch user details from the database
      return userDetails;  // Should return { email, profilePic }
    } catch (error) {
      console.error("Error fetching additional user data:", error);
      return {};  // Return an empty object if there's an error
    }
  };

  const handleLogin = async () => {
    const newErrors = {};
    console.log("Login button pressed.");

    // Validation checks
    if (username === '') newErrors.username = 'Username is required';
    if (password === '') newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      console.log("Validation failed with errors:", newErrors);
      setErrors(newErrors);
      return; // Prevent form submission if validation fails
    }

    console.log("Attempting to log in with username:", username);

    try {
      const result = await DatabaseCommunicator.loginUser(username, password);

      console.log("Login response from Supabase:", result);

      if (result.success && result.user) {
        console.log("Login successful.");

        // Logging the result.user data before passing it to User.fromData
        console.log("User data from login response:", result.user);

        // Fetch additional user details (e.g., email, profile picture) asynchronously
        const additionalUserData = await fetchAdditionalUserData(result.user.id);
        console.log("Additional user data fetched:", additionalUserData);

        // Creating the User instance with additional data
        const userData = await User.fromData(result.user, fetchAdditionalUserData);
        console.log("User instance created:", userData);

        // Set user data in context
        setUser(userData);  // Make sure to set the new user data here

        // Navigate to the Home screen
        navigation.navigate('Home');
      } else {
        setErrors({ login: result.message });
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErrors({ login: "An unexpected error occurred. Please try again later." });
    }
  };



  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Logo.png')} style={styles.logo} />
      <Text style={styles.title}>Log in to your account</Text>

      <InputField
        icon="person-outline"
        value={username}
        placeholder="Username"
        onChangeText={(text) => { setUsername(text); setErrors({ ...errors, username: null }); }}
        error={errors.username}
      />
      {errors.username && <ErrorText message={errors.username} />}

      <InputField
        icon="lock-closed-outline"
        value={password}
        placeholder="Password"
        onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: null }); }}
        secureTextEntry={!showPassword}
        error={errors.password}
        showPasswordToggle={true}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      {errors.password && <ErrorText message={errors.password} />}

      {errors.login && <ErrorText message={errors.login} />}

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.footer}>Don't have an account? <Text style={styles.footerLink}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
