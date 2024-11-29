import requests
import base64
from flask import Flask, request, redirect, jsonify
import sqlite3
from datetime import datetime, timedelta

app = Flask(__name__)

# Spotify credentials
CLIENT_ID = ""
CLIENT_SECRET = ""
#replace with your own client id and secret
REDIRECT_URI = "http://localhost:5000/callback"
SCOPES = 'user-top-read%20user-library-read%20user-read-recently-played'

# Database setup
def init_db():
    conn = sqlite3.connect('spotify_users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    access_token TEXT,
                    refresh_token TEXT,
                    expires_at TIMESTAMP
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS top_tracks (
                    user_id TEXT,
                    track_name TEXT,
                    artist_name TEXT,
                    PRIMARY KEY (user_id, track_name, artist_name),
                    FOREIGN KEY (user_id) REFERENCES users (user_id)
                )''')
    conn.commit()
    conn.close()

# Step 1: Generate Authorization URL
def get_authorization_url():
    auth_url = "https://accounts.spotify.com/authorize"
    return (
        f"{auth_url}?client_id={CLIENT_ID}&response_type=code"
        f"&redirect_uri={REDIRECT_URI}&scope={SCOPES}&state=unique_state_string"
    )

# Function to refresh the access token
def refresh_access_token(refresh_token):
    token_url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode(),
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }
    response = requests.post(token_url, headers=headers, data=data)
    token_response = response.json()

    if response.status_code != 200:
        return None, token_response.get('error_description', 'Unknown error')

    new_access_token = token_response.get("access_token")
    expires_in = token_response.get("expires_in")
    expires_at = datetime.now().timestamp() + expires_in

    return new_access_token, expires_at

# Function to get the user's access token, refreshing it if necessary
def get_access_token(user_id):
    conn = sqlite3.connect('spotify_users.db')
    c = conn.cursor()
    c.execute("SELECT access_token, refresh_token, expires_at FROM users WHERE user_id=?", (user_id,))
    result = c.fetchone()
    conn.close()

    if not result:
        return None, "User not found or not authenticated."

    access_token, refresh_token, expires_at = result

    # Check if the access token has expired
    if datetime.now().timestamp() >= expires_at:
        # Refresh the access token
        new_access_token, new_expires_at = refresh_access_token(refresh_token)
        if new_access_token:
            # Update the database with the new token and expiration time
            conn = sqlite3.connect('spotify_users.db')
            c = conn.cursor()
            c.execute('''UPDATE users SET access_token=?, expires_at=? WHERE user_id=?''',
                    (new_access_token, new_expires_at, user_id))
            conn.commit()
            conn.close()
            return new_access_token, None
        else:
            return None, "Failed to refresh access token."

    return access_token, None

# Step 2: Home Route - Direct User to Spotify Authorization URL
@app.route("/")
def index():
    return redirect(get_authorization_url())

# Step 3: Callback Route - Handle Redirect and Get Access Token
@app.route("/callback")
def callback():
    auth_code = request.args.get("code")
    if not auth_code:
        return "Error: No authorization code provided.", 400

    token_url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode(),
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": REDIRECT_URI,
    }
    response = requests.post(token_url, headers=headers, data=data)
    token_response = response.json()

    ACCESS_TOKEN = token_response.get("access_token")
    refresh_token = token_response.get("refresh_token")
    expires_in = token_response.get("expires_in")
    expires_at = datetime.now().timestamp() + expires_in

    if not ACCESS_TOKEN:
        return f"Error: {token_response.get('error_description', 'Failed to retrieve token.')}", 400

    # Fetch user profile to get unique user ID
    user_profile_url = "https://api.spotify.com/v1/me"
    user_headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    user_response = requests.get(user_profile_url, headers=user_headers)

    if user_response.status_code != 200:
        return f"Error fetching user profile: {user_response.json().get('error', {}).get('message', 'Unknown error')}", 400

    user_data = user_response.json()
    user_id = user_data.get("id")  # Get unique user ID from the response

    # Store user data in the database

    conn = sqlite3.connect('spotify_users.db')
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO users (user_id, access_token, refresh_token, expires_at)
                VALUES (?, ?, ?, ?)''', (user_id, ACCESS_TOKEN, refresh_token, expires_at))
    conn.commit()
    conn.close()

    return f"Authorization successful! Your unique user ID is {user_id}. You can now access your top tracks at /top-tracks."

#used for debugging
@app.route("/top-tracks")
def top_tracks():
    user_id = "unique_user_id"  # Replace with the actual user ID logic
    access_token, error = get_access_token(user_id)

    if not access_token:
        return f"Error: {error}", 400

    top_tracks_url = "https://api.spotify.com/v1/me/top/tracks"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "limit": 10,
        "time_range": "medium_term"
    }
    response = requests.get(top_tracks_url, headers=headers, params=params)

    if response.status_code != 200:
        return f"Error fetching top tracks: {response.json().get('error', {}).get('message', 'Unknown error')}", 400

    tracks = response.json().get("items", [])
    top_songs = [{"name": track["name"], "artist": track["artists"][0]["name"]} for track in tracks]

    return jsonify(top_songs)

@app.route("/user/<user_id>/top-tracks")
def user_top_tracks(user_id):
    access_token, error = get_access_token(user_id)

    if not access_token:
        return f"Error: {error}", 400

    top_tracks_url = "https://api.spotify.com/v1/me/top/tracks"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "limit": 2,
        "time_range": "medium_term"
    }
    response = requests.get(top_tracks_url, headers=headers, params=params)

    if response.status_code != 200:
        return f"Error fetching top tracks: {response.json().get('error', {}).get('message', 'Unknown error')}", 400

    tracks = response.json().get("items", [])

    return jsonify(tracks)

@app.route("/user/<user_id>/top-genres")
def get_top_genres(user_id):
    
    access_token, error = get_access_token(user_id)

    if not access_token:
        return f"Error fetching top genres for user {user_id}: {error}", 400

    top_artists_url = "https://api.spotify.com/v1/me/top/artists"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "limit": 2,  # Adjust the limit as needed
        "time_range": "medium_term"  # or "short_term" or "long_term"
    }
    response = requests.get(top_artists_url, headers=headers, params=params)

    if response.status_code != 200:
        return f"Error fetching top artists: {response.json().get('error', {}).get('message', 'Unknown error')}", 400

    artists = response.json().get("items", [])
    top_genres = {}

    for artist in artists:
        for genre in artist.get("genres", []):
            top_genres[genre] = top_genres.get(genre, 0) + 1

    sorted_genres = sorted(top_genres.items(), key=lambda x: x[1], reverse=True)
    top_genres_list = [genre for genre, _ in sorted_genres[:5]]  #

    return jsonify(sorted_genres)

@app.route("/user/<user_id>/top-artists")
def get_top_artists(user_id):
    access_token, error = get_access_token(user_id)

    if not access_token:
        return f"Error fetching top artists for user {user_id}: {error}", 400

    top_artists_url = "https://api.spotify.com/v1/me/top/artists"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "limit": 2,  # Adjust the limit as needed
        "time_range": "medium_term"  # or "short_term" or "long_term"
    }
    response = requests.get(top_artists_url, headers=headers, params=params)

    if response.status_code != 200:
        return f"Error fetching top artists: {response.json().get('error', {}).get('message', 'Unknown error')}", 400

    artists = response.json().get("items", [])
    top_artists = [{"name": artist["name"], "genres": artist["genres"]} for artist in artists]

    return jsonify(artists)

@app.route("/recommendation/<user_id1>/<user_id2>")
def recommend_playlist(user_id1, user_id2):
    # Replace 'http://localhost:5000' with your actual app's base URL if different
    base_url = "http://localhost:5000"

    # Fetch the access tokens for both users
    access_token1, error1 = get_access_token(user_id1)
    access_token2, error2 = get_access_token(user_id2)

    if not access_token1:
        return f"Error fetching access token for user {user_id1}: {error1}", 400

    if not access_token2:
        return f"Error fetching access token for user {user_id2}: {error2}", 400

    # Fetch the top artists and top genres for each user by making HTTP requests to the Flask routes
    response1_artists = requests.get(f"{base_url}/user/{user_id1}/top-artists")
    response2_artists = requests.get(f"{base_url}/user/{user_id2}/top-artists")
    top_songs1 = user_top_tracks(user_id1).get_json()
    top_songs2 = user_top_tracks(user_id2).get_json()

    # Check if we have enough songs to make a recommendation
    if len(top_songs1) < 2 or len(top_songs2) < 2:
        return "Error: Not enough top songs available for each user to generate recommendations.", 400


    response1_genres = requests.get(f"{base_url}/user/{user_id1}/top-genres")
    response2_genres = requests.get(f"{base_url}/user/{user_id2}/top-genres")

    if response1_artists.status_code != 200:
        return f"Error fetching top artists for user {user_id1}: {response1_artists.text}", 400

    if response2_artists.status_code != 200:
        return f"Error fetching top artists for user {user_id2}: {response2_artists.text}", 400

    if response1_genres.status_code != 200:
        return f"Error fetching top genres for user {user_id1}: {response1_genres.text}", 400

    if response2_genres.status_code != 200:
        return f"Error fetching top genres for user {user_id2}: {response2_genres.text}", 400

    # Extract top artists and genres from the responses
    top_artists1 = response1_artists.json()
    top_artists2 = response2_artists.json()
    top_genres1 = response1_genres.json()
    top_genres2 = response2_genres.json()

    # Extract the first 4 artist IDs from each user's top artists
    artist_ids = []
    for artist in top_artists1[:4]:
        artist_ids.append(artist["id"])
    for artist in top_artists2[:4]:
        artist_ids.append(artist["id"])

    # Extract the top 2 songs from each user
    seed_tracks = []
    for song in top_songs1[:2]:
        seed_tracks.append(f"{song['name']} by {song['artist']}")
    for song in top_songs2[:2]:
        seed_tracks.append(f"{song['name']} by {song['artist']}")
    top_genres1 = [genre for genre_list in top_genres1 for genre in genre_list]
    top_genres2 = [genre for genre_list in top_genres2 for genre in genre_list]

    
    # Now create sets from them
    all_genres = set(top_genres1) | set(top_genres2)
    # Convert the artist IDs to a comma-separated string
    artist_ids_str = ','.join(artist_ids[:4])  # Limit to 4 artist IDs

    # Use the Spotify API to get a recommended playlist based on these artist IDs and genres
    recommendations_url = "https://api.spotify.com/v1/recommendations"
    headers = {
        "Authorization": f"Bearer {access_token1}"  # Use one token for simplicity
    }

    
    params = {
        "seed_tracks": ','.join(seed_tracks),
        "seed_artists": artist_ids_str,
        "seed_genres": ','.join([str(genre) for genre in all_genres]),
        "limit": 10  # Adjust the number of recommendations as needed
    }
    response = requests.get(recommendations_url, headers=headers, params=params)
    print("Response status code:", response.status_code)
    print("Response content:", response.text)
    if response.status_code != 200:
        print("Error response content:", response.text)
        return f"Error fetching recommendations: {response.status_code} {response.text}", 400

    try:
        recommendations = response.json()
    except ValueError:
        return f"Error parsing response: {response.text}", 400

    if "tracks" not in recommendations:
        return f"Unexpected response format: {recommendations}", 400

    recommended_songs = [{"name": track["name"], "artist": track["artists"][0]["name"]} for track in recommendations["tracks"]]

    return jsonify(recommended_songs)



if __name__ == "__main__":
    init_db()  # Ensure the database is set up
    print("Visit the following URL to authorize:")
    print(get_authorization_url())
    app.run(debug=True, port=5000)
