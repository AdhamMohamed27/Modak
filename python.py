from flask import Flask, redirect, url_for, session, request, render_template
import os
import requests
from dotenv import load_dotenv
import base64
# datetime library to convert the ISO 8601 timestamp to a more readable format before passing it to the template.
from datetime import datetime 
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import random
from flask import jsonify
from ai_module.emotion_detector import detect_emotion 



    
# Load environment variables
load_dotenv()


# Error handling 
# print("CLIENT ID:", os.getenv("SPOTIFY_CLIENT_ID"))
# print("CLIENT Secret:", os.getenv("SPOTIFY_CLIENT_SECRET"))
# print("url:", os.getenv("SPOTIFY_REDIRECT_URI"))



# The secret_key is what makes sure this data is secure and can’t be tampered with.
# Think of the secret_key as a unique password that only the server knows, which it uses to encrypt and verify data sent to users’ browsers. 
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generates a random 24-byte secret key each time
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")


@app.route('/detect-emotion', methods=['POST'])
def detect_emotion_endpoint():
    """
    Flask endpoint to handle emotion detection requests.
    """
    try:
        # Call the detect_emotion function
        emotion = detect_emotion()
        
        # Return the detected emotion as JSON
        return jsonify({"emotion": emotion}), 200
    
    except Exception as e:
        # Log the error to the console
        print(f"Error in /detect-emotion: {e}")
        
        # Return the error message as JSON with a 500 status code
        return jsonify({"error": str(e)}), 500

    


# This route doesn’t do much on its own; it immediately redirects users to the /login route. 
# Essentially, it serves as a starting point that directs users to the login process.
@app.route('/')
def home():
    return redirect(url_for('login'))


# This route starts the Spotify authentication process. 
# It creates an authorization URL with the necessary scopes, client ID, and redirect URI(environment variables), 
# then redirects the user to Spotify’s authorization page.
@app.route('/login')
def login():
    scope = "user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-modify-public playlist-modify-private"
    auth_url = (
        f"https://accounts.spotify.com/authorize"
        f"?response_type=code&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope={scope}"
    )
    return redirect(auth_url)


# When the user is redirected back to the /callback endpoint after authorizing the app on Spotify, Spotify sends an authorization code as a query parameter. 
# This code is extracted using request.args.get("code").

@app.route('/callback')
def callback():
    code = request.args.get("code")
    token_url = "https://accounts.spotify.com/api/token"
   
# Base64-encoded authorization header with Client ID and Client Secret
    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI
    }
    
    # Send POST request to get the access token and refresh token
    response = requests.post(token_url, headers=headers, data=data)
    response_data = response.json()
    
    # Store access and refresh tokens in session
    session["access_token"] = response_data.get("access_token")
    session["refresh_token"] = response_data.get("refresh_token")

    print("Access Token:", session.get("access_token"))
    print("Refresh Token:", session.get("refresh_token"))

    
# After successfully storing the tokens, the user is redirected to the /dashboard endpoint to view their personalized dashboard.

    return redirect(url_for("dashboard"))


# The function first checks if there’s an access_token stored in the session. 
# If the access token isn’t found, it means the user hasn’t authorized the app yet, so it redirects them to the /login route to start the authentication process.

@app.route('/dashboard')
def dashboard():

    access_token = session.get("access_token")
    if not access_token:
        return redirect(url_for("login"))

    headers = {"Authorization": f"Bearer {access_token}"}

    # Retrieve User's Profile Information
    response_user = requests.get("https://api.spotify.com/v1/me", headers=headers)
    if response_user.status_code == 200:
        user_info = response_user.json()
        user_data = {
            "display_name": user_info['display_name'],
            "profile_image": user_info['images'][0]['url'] if user_info['images'] else None,
            "followers": user_info['followers']['total'],
            "country": user_info['country']
        }
    else:
        user_data = {}

    # Retrieve User's Recently Played Tracks
    response_recent = requests.get("https://api.spotify.com/v1/me/player/recently-played", headers=headers)
    recent_tracks = response_recent.json().get("items") if response_recent.status_code == 200 else []
    recent_track_data = [{
        "name": item['track']['name'],
        "artist": item['track']['artists'][0]['name'],
        "album": item['track']['album']['name'],
        "cover_url": item['track']['album']['images'][0]['url'],
        "played_at": "Day: " + datetime.fromisoformat(item['played_at'].replace("Z", "+00:00")).strftime('%Y-%m-%d') +
                     " Time: " + datetime.fromisoformat(item['played_at'].replace("Z", "+00:00")).strftime('%H:%M:%S')
    } for item in recent_tracks]

    # Retrieve User's Top Tracks
    response_top_tracks = requests.get("https://api.spotify.com/v1/me/top/tracks", headers=headers)
    top_tracks = response_top_tracks.json().get("items") if response_top_tracks.status_code == 200 else []
    top_track_data = [{
        "name": track['name'],
        "artist": track['artists'][0]['name'],
        "album": track['album']['name'],
        "cover_url": track['album']['images'][0]['url']
    } for track in top_tracks]

    # Retrieve User's Top Artists
    response_top_artists = requests.get("https://api.spotify.com/v1/me/top/artists", headers=headers)
    top_artists = response_top_artists.json().get("items") if response_top_artists.status_code == 200 else []
    top_artist_data = [{
        "name": artist['name'],
        "genres": ', '.join(artist['genres']),
        "followers": artist['followers']['total'],
        "image_url": artist['images'][0]['url'] if artist['images'] else None
    } for artist in top_artists]

    # Retrieve User's Saved Tracks
    response_saved_tracks = requests.get("https://api.spotify.com/v1/me/tracks", headers=headers)
    saved_tracks = response_saved_tracks.json().get("items") if response_saved_tracks.status_code == 200 else []
    saved_track_data = [{
        "name": track['track']['name'],
        "artist": track['track']['artists'][0]['name'],
        "album": track['track']['album']['name'],
        "cover_url": track['track']['album']['images'][0]['url']
    } for track in saved_tracks]

    # Retrieve User's Saved Albums
    response_saved_albums = requests.get("https://api.spotify.com/v1/me/albums", headers=headers)
    saved_albums = response_saved_albums.json().get("items") if response_saved_albums.status_code == 200 else []
    saved_album_data = [{
        "name": album['album']['name'],
        "artist": album['album']['artists'][0]['name'],
        "cover_url": album['album']['images'][0]['url']
    } for album in saved_albums]

    # Render the template with all the data
    return render_template("dashboard.html", 
                           user_name=user_data.get("display_name"),
                           user_profile_image=user_data.get("profile_image"),
                           user_country=user_data.get("country"),
                           user_followers=user_data.get("followers"),
                           recent_tracks=recent_track_data,
                           top_tracks=top_track_data,
                           top_artists=top_artist_data,
                           saved_tracks=saved_track_data,
                           saved_albums=saved_album_data)

@app.route('/logout')
def logout():
    print("Logging out...")  # Debugging print
    print("Access token before logout:", session.get("access_token"))  # Check if access token exists
    session.pop("access_token", None)  # Remove the access token from the session
    print("Access token after logout:", session.get("access_token"))  # Check if it's removed
    return redirect(url_for("login"))


@app.route('/generate-random-playlist', methods=['POST'])
def generate_random_playlist():
    access_token = session.get("access_token")
    if not access_token:
        return redirect(url_for("login"))

    headers = {"Authorization": f"Bearer {access_token}"}

    # Predefined genres to choose from
    genres = ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country']
    random_genre = random.choice(genres)  # Pick a random genre

    # Fetch recommendations
    recommendations_url = "https://api.spotify.com/v1/recommendations"
    params = {
        "seed_genres": random_genre,
        "limit": 20
    }
    response = requests.get(recommendations_url, headers=headers, params=params)
    if response.status_code != 200:
        return f"Error fetching recommendations: {response.json().get('error', {}).get('message', 'Unknown error')}", 500

    # Extract track URIs
    tracks = response.json().get('tracks', [])
    track_uris = [track['uri'] for track in tracks]

    # Create a new playlist
    user_response = requests.get("https://api.spotify.com/v1/me", headers=headers)
    user_id = user_response.json().get("id")

    create_playlist_url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    payload = {
        "name": "Random Playlist",
        "description": "A playlist with random tracks generated by Modak!",
        "public": False
    }
    create_response = requests.post(create_playlist_url, headers=headers, json=payload)
    if create_response.status_code != 201:
        return f"Error creating playlist: {create_response.json().get('error', {}).get('message', 'Unknown error')}", 500

    playlist_data = create_response.json()
    playlist_id = playlist_data.get("id")
    playlist_url = playlist_data.get("external_urls", {}).get("spotify")  # Extract the playlist URL

    # Add tracks to the playlist
    add_tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    add_tracks_response = requests.post(add_tracks_url, headers=headers, json={"uris": track_uris})
    if add_tracks_response.status_code != 201:
        return f"Error adding tracks: {add_tracks_response.json().get('error', {}).get('message', 'Unknown error')}", 500

    # Return the playlist URL
    return {"message": "Random Playlist created successfully!", "url": playlist_url}, 200



@app.route('/generate-mood-playlist', methods=['POST'])
def generate_mood_playlist():
    access_token = session.get("access_token")
    if not access_token:
        return redirect(url_for("login"))

    headers = {"Authorization": f"Bearer {access_token}"}

    # Get mood input from the frontend
    data = request.get_json()
    mood = data.get("mood", "happy")  # Default to "happy" if no mood is provided

    # Map moods to genres
    mood_genre_map = {
        "happy": ["pop", "dance"],
        "sad": ["acoustic", "piano"],
        "relaxed": ["chill", "ambient"],
        "energetic": ["rock", "electronic"]
    }
    genres = mood_genre_map.get(mood, ["pop"])  # Default to "pop" if mood not found

    # Fetch recommendations
    recommendations_url = "https://api.spotify.com/v1/recommendations"
    params = {
        "seed_genres": random.choice(genres),  # Pick a genre for variety
        "limit": 20
    }
    response = requests.get(recommendations_url, headers=headers, params=params)
    if response.status_code != 200:
        return f"Error fetching recommendations: {response.json().get('error', {}).get('message', 'Unknown error')}", 500

    # Extract track URIs
    tracks = response.json().get('tracks', [])
    track_uris = [track['uri'] for track in tracks]

    # Create a new playlist
    user_response = requests.get("https://api.spotify.com/v1/me", headers=headers)
    user_id = user_response.json().get("id")

    create_playlist_url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    payload = {
        "name": f"{mood.capitalize()} Playlist",
        "description": f"A playlist based on your mood: {mood.capitalize()}",
        "public": False
    }
    create_response = requests.post(create_playlist_url, headers=headers, json=payload)
    if create_response.status_code != 201:
        return f"Error creating playlist: {create_response.json().get('error', {}).get('message', 'Unknown error')}", 500

    playlist_data = create_response.json()
    playlist_id = playlist_data.get("id")
    playlist_url = playlist_data.get("external_urls", {}).get("spotify")  # Extract the playlist URL

    # Add tracks to the playlist
    add_tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    add_tracks_response = requests.post(add_tracks_url, headers=headers, json={"uris": track_uris})
    if add_tracks_response.status_code != 201:
        return f"Error adding tracks: {add_tracks_response.json().get('error', {}).get('message', 'Unknown error')}", 500

    # Return the playlist URL
    return {"message": f"{mood.capitalize()} Playlist created successfully!", "url": playlist_url}, 200

   
if __name__ == "__main__":
    app.run(debug=True)


