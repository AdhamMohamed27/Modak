import { supabase } from './supabaseClient';

const DatabaseCommunicator = {
  // Method to handle user registration
  async registerUser(username, email, password) {
    try {
      // Check if username already exists
      const { data: usernameCheck } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (usernameCheck) {
        throw new Error('Username is already taken');
      }

      // Check if email already exists
      const { data: emailCheck } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (emailCheck) {
        throw new Error('Email is already taken');
      }

      // Set the URL for the default profile picture
      const DEFAULT_PROFILE_PIC_URL = 'https://rjmjxeepwevsdecserxk.supabase.co/storage/v1/object/sign/profile_pics/default_profilepic.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9maWxlX3BpY3MvZGVmYXVsdF9wcm9maWxlcGljLnBuZyIsImlhdCI6MTczMjAxMzMwMiwiZXhwIjoxNzYzNTQ5MzAyfQ.hcbxTUTPnxhO-go6eqvdGbodJFYT36MkE92DIr5W-s0&t=2024-11-19T10%3A48%3A18.527Z';

      // Insert user into the database
      const { error } = await supabase
        .from('users')
        .insert([{
          username,
          email,
          password, // Ensure password is hashed in production
          profile_pic: DEFAULT_PROFILE_PIC_URL, // Use the new default profile pic URL
        }]);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Method to handle user login
  async loginUser(username, password) {
    try {
      // Fetch user data based on username
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, profile_pic, password')  // Include email and profile_pic
        .eq('username', username)
        .single();

      if (error || !data || data.password !== password) {
        throw new Error('Invalid username or password');
      }

      return { success: true, user: data }; // Return user data with email and profile_pic
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Method to fetch additional user details like email and profile pic based on userId
  async getUserDetails(userId) {
    try {
      // Fetch user details from the database
      const { data, error } = await supabase
        .from('users')
        .select('email, profile_pic')
        .eq('id', userId)
        .single();

      if (error || !data) {
        throw new Error('Failed to fetch user details');
      }

      return data;  // Return email and profile_pic
    } catch (error) {
      console.error("Error fetching additional user data:", error);
      return {};  // Return an empty object if there's an error
    }
  },
};

export default DatabaseCommunicator;
