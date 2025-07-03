import React, { createContext, useContext, useState } from 'react';

// Create UserContext to manage the user state globally
const UserContext = createContext();

// User class definition
class User {
    constructor(id, username, email = null, profilePic = null, access_token=null, user_id=null) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.profilePic = profilePic;
    }

    // This method initializes the user or updates missing fields.
    static async fromData(data, fetchAdditionalData) {
        let email = data.email || null;
        let profilePic = data.profile_pic || null;

        // Fetch additional data if necessary
        if (!email || !profilePic) {
            const fullUserData = await fetchAdditionalData(data.id);
            email = email || fullUserData.email;
            profilePic = profilePic || fullUserData.profilePic;
        }

        // Return a new User instance
        return new User(data.id, data.username, email, profilePic);
    }
}

// Create UserProvider to manage the user state globally
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to store the user data

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => {
    return useContext(UserContext);
};

export default User;
