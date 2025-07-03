import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../frontend/screens/Home/Home';
import Profile from '../frontend/screens/Profile/Profile';
import Settings from '../frontend/screens/Settings/Settings';
import PrivacyAndSecurity from '../frontend/screens/Settings/PrivacyAndSecurity';
import AccountSettings from '../frontend/screens/Settings/AccountSettings';
import Notifications from '../frontend/screens/Settings/Notifications';
import AppPreferences from '../frontend/screens/Settings/AppPreferences';
import HelpAndSupport from '../frontend/screens/Settings/HelpAndSupport';
import Login from '../frontend/screens/Login/Login';
import Registration from '../frontend/screens/Registration/Registration';
import ForgotPassword from '../frontend/screens/ForgotPassword/ForgotPassword';
import Emotion from '../frontend/screens/Emotion';
import Social from '../frontend/screens/Social/Social';
import AddFriends from '../frontend/screens/AddFriends/AddFriends';
import Requests from '../frontend/screens/Requests/Requests';
import EditProfile from '../frontend/screens/EditProfile/EditProfile';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Authentication Screens */}
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />

      {/* Main App Screens */}
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyAndSecurity" component={PrivacyAndSecurity} options={{ headerShown: false }} />
      <Stack.Screen name="AccountSettings" component={AccountSettings} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
      <Stack.Screen name="AppPreferences" component={AppPreferences} options={{ headerShown: false }} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} options={{ headerShown: false }} />
      <Stack.Screen name="Emotion" component={Emotion} options={{ headerShown: false }} />

      {/* Social Screen */}
      <Stack.Screen name="Social" component={Social} options={{ headerShown: false }} />
        <Stack.Screen name="AddFriends" component={AddFriends} options={{ headerShown: false }} />
      <Stack.Screen name="Requests" component={Requests} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
