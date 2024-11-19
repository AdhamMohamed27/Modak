class User {
    static instance = null;

    constructor(id, username, email = null, profilePic = null) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.profilePic = profilePic;
    }

    // This method initializes the user or updates missing fields.
    static async fromData(data, fetchAdditionalData) {
        if (!User.instance) {
            let email = data.email || null;
            let profilePic = data.profile_pic || null; // Fetch profile_pic correctly

            // Fetch additional data if necessary
            if (!email || !profilePic) {
                const fullUserData = await fetchAdditionalData(data.id);
                email = email || fullUserData.email;
                profilePic = profilePic || fullUserData.profilePic;
            }

            // Ensure the user is created with email and profilePic populated
            User.instance = new User(data.id, data.username, email, profilePic);
        }
        return User.instance;
    }

    static getInstance() {
        return User.instance;
    }
}

export default User;
