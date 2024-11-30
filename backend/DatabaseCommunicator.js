import { supabase } from './supabaseClient';

const DatabaseCommunicator = {
  // User Registration
  async registerUser(username, email, password) {
    try {
      const { data: usernameCheck } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (usernameCheck) throw new Error('Username is already taken');

      const { data: emailCheck } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (emailCheck) throw new Error('Email is already taken');

      const DEFAULT_PROFILE_PIC_URL = 'https://rjmjxeepwevsdecserxk.supabase.co/storage/v1/object/sign/profile_pics/default_profilepic.png?...';

      const { error } = await supabase
        .from('users')
        .insert([{ username, email, password, profile_pic: DEFAULT_PROFILE_PIC_URL }]);

      if (error) throw new Error(error.message);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // User Login
  async loginUser(username, password) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, profile_pic, password')
        .eq('username', username)
        .single();

      if (error || !data || data.password !== password) {
        throw new Error('Invalid username or password');
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Fetch User Details
  async getUserDetails(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, email, profile_pic')
        .eq('id', userId)
        .single();

      if (error || !data) throw new Error('Failed to fetch user details');

      return data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return {};
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, profile_pic'); // Adjust fields as needed

      if (error) throw new Error('Failed to fetch users');

      return data; // Returns all users
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return []; // Return empty array if there's an error
    }
  },

  // Get Friend Requests (with sender details)
  async getFriendRequests(userId) {
    try {
      // Step 1: Fetch friend requests with sender_id and receiver_id
      const { data: requests, error: requestError } = await supabase
        .from('friend_requests')
        .select('id, sender_id, status')
        .eq('receiver_id', userId)  // This will filter friend requests where the user is the receiver
        .eq('status', 'pending');   // Only fetching pending requests

      if (requestError) {
        console.error('Error fetching friend requests:', requestError);
        throw new Error('Failed to fetch friend requests');
      }

      // Step 2: Fetch the sender details (username, profile_pic) for each request
      const requestsWithSenderDetails = await Promise.all(requests.map(async (request) => {
        const { data: senderData, error: senderError } = await supabase
          .from('users')
          .select('username, profile_pic')
          .eq('id', request.sender_id) // Get the sender's details using sender_id
          .single(); // Since sender_id is unique, use `.single()` to fetch one row

        if (senderError || !senderData) {
          console.error('Error fetching sender details:', senderError);
          return { ...request, sender: { username: 'Unknown', profile_pic: '' } }; // Default values in case of error
        }

        // Add the sender details to the request object
        return { ...request, sender: senderData };
      }));

      console.log('Friend Requests with sender details:', requestsWithSenderDetails);
      return requestsWithSenderDetails;
    } catch (error) {
      console.error('Error in getFriendRequests function:', error);
      return [];
    }
  },


  // Check if a friend request already exists between sender and receiver
  async checkFriendRequestExists(senderId, receiverId) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select('id')
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)
        .eq('status', 'pending')
        .single();

      if (error) throw new Error('Failed to check friend request');

      return data ? true : false; // Return true if request exists, false if not
    } catch (error) {
      console.error('Error checking if request exists:', error.message);
      return false;
    }
  },

  // Send a Friend Request
  async sendFriendRequest(senderId, receiverId) {
    try {
      // Check if the user exists (receiver) by ID
      const { data: receiver, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', receiverId)  // Use receiverId directly for lookup
        .single();

      if (userError || !receiver) throw new Error('User not found');

      // Check if the friend request already exists
      const requestExists = await this.checkFriendRequestExists(senderId, receiverId);

      if (requestExists) throw new Error('Friend request already sent');

      // Insert the new friend request into the database
      const { error } = await supabase
        .from('friend_requests')
        .insert([{ sender_id: senderId, receiver_id: receiverId, status: 'pending' }]);

      if (error) throw new Error('Failed to send friend request');

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Respond to Friend Request
  async respondToFriendRequest(requestId, accept) {
    try {
      const newStatus = accept ? 'accepted' : 'denied';

      const { error } = await supabase
        .from('friend_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw new Error('Failed to update friend request status');

      if (accept) {
        const { data: request } = await supabase
          .from('friend_requests')
          .select('sender_id, receiver_id')
          .eq('id', requestId)
          .single();

        await supabase
          .from('friends')
          .insert([
            { user_id: request.sender_id, friend_id: request.receiver_id },
            { user_id: request.receiver_id, friend_id: request.sender_id }
          ]);
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get Friends
  async getFriends(userId) {
    try {
      // Fetch the friend's ids from the friends table
      const { data: friendIds, error } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', userId);

      if (error) throw new Error('Failed to fetch friends');

      // Fetch user details (username, profile_pic) for each friend
      const friends = await Promise.all(friendIds.map(async (friend) => {
        const { data, error: userError } = await supabase
          .from('users')
          .select('id, username, profile_pic')
          .eq('id', friend.friend_id)
          .single();

        if (userError || !data) {
          console.error('Error fetching friend details:', userError);
          return null; // If there's an error, return null
        }

        return data;
      }));

      // Filter out any null values (in case of errors) and return the list of friends
      return friends.filter(friend => friend !== null);
    } catch (error) {
      console.error('Error fetching friends:', error.message);
      return [];
    }
  },

  // Get all Friend Requests for a User
  async getPendingFriendRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id, status')
        .eq('receiver_id', userId)
        .eq('status', 'pending');

      if (error) throw new Error('Failed to fetch pending friend requests');

      return data;
    } catch (error) {
      return [];
    }
  },

  // Get all Friends of a User
  async getAllFriends(userId) {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', userId);

      if (error) throw new Error('Failed to fetch all friends');

      return data;
    } catch (error) {
      return [];
    }
  },
  // Update User Profile
async updateUserProfile(userId, username, email, profilePicUrl) {
  try {
    console.log("Updating user profile...");
    console.log(`User ID: ${userId}`);
    console.log(`New Username: ${username}`);
    console.log(`New Email: ${email}`);
    console.log(`Profile Picture URL: ${profilePicUrl}`);

    // Check if the username is already taken by another user
    const { data: usernameCheck, error: usernameError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .neq('id', userId);  // Ensure it's not the same user

    if (usernameError) {
      console.error('Error checking username:', usernameError);
      throw new Error('Failed to check username availability');
    }

    if (usernameCheck.length > 0) {
      console.error('Username is already taken');
      return { success: false, message: 'Username is already in use', field: 'username' };
    }

    // Check if the email is already taken by another user
    const { data: emailCheck, error: emailError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', userId);  // Ensure it's not the same user

    if (emailError) {
      console.error('Error checking email:', emailError);
      throw new Error('Failed to check email availability');
    }

    if (emailCheck.length > 0) {
      console.error('Email is already taken');
      return { success: false, message: 'Email is already in use', field: 'email' };
    }

    // Update user profile in the database if checks pass
    const { error } = await supabase
      .from('users')
      .update({ username, email, profile_pic: profilePicUrl })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }

    console.log('Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in updateUserProfile function:', error);
    return { success: false, message: error.message };
    }
  },

 // Upload Profile Picture Function
 async uploadProfilePicture(uri, userId) {
   try {
     // Validate the userId
     if (!userId) {
       throw new Error("User ID is undefined. Cannot upload profile picture.");
     }
     console.log("Uploading profile picture for userId:", userId);

     // Extract file extension and generate a unique file name
     const fileExtension = uri.split('.').pop();
     const fileName = `${Date.now()}.${fileExtension}`;
     const filePath = fileName; // Ensure the file is placed in the correct folder

     console.log("File path for upload:", filePath);

     // Upload the file to Supabase storage
     const { data, error: uploadError } = await supabase.storage
       .from('profile_pics')
       .upload(filePath, {
         uri,
         type: `image/${fileExtension}`,
         name: fileName,
       });

     if (uploadError) {
       throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
     }
     console.log("File uploaded successfully:", data);

     // Get the public URL for the uploaded file
     const { data: publicUrlData, error: urlError } = supabase.storage
       .from('profile_pics')
       .getPublicUrl(filePath);

     if (urlError || !publicUrlData?.publicUrl) {
       throw new Error(`Failed to retrieve profile picture URL: ${urlError?.message || 'Unknown error'}`);
     }
     const publicUrl = publicUrlData.publicUrl;
     console.log("Profile picture uploaded successfully. URL:", publicUrl);

     // Save the profile picture URL in the user table
     const { error: updateError } = await supabase
       .from('users')
       .update({ profile_pic: publicUrl })
       .eq('id', userId);

     if (updateError) {
       throw new Error(`Failed to save profile picture URL: ${updateError.message}`);
     }
     console.log("Profile picture URL saved successfully for userId:", userId);

     return publicUrl; // Return the public URL
   } catch (error) {
     console.error("Error uploading profile picture:", error.message);
     throw error;
   }
 }

};

export default DatabaseCommunicator;
