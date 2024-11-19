import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator'; // Adjust the path as needed

const App = () => {
    return (
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
};

export default App;
