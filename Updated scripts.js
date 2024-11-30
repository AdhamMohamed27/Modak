document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript file loaded!");

    const moodButton = document.getElementById("generateMoodPlaylist");
    const randomButton = document.querySelector("form[action='/generate-random-playlist'] button");
    const detectEmotionButton = document.getElementById("detectEmotion");

    // Generate Random Playlist (from the Flask code's '/create_playlist' endpoint)
    randomButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        fetch("/create_playlist", {
            method: "POST",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse response as JSON
                } else {
                    throw new Error("Failed to generate playlist");
                }
            })
            .then((data) => {
                console.log("Response data:", data);
                alert(data.message); // Show success message
                if (data.url) {
                    window.location.href = data.url; // Redirect to Spotify playlist URL
                } else {
                    console.error("No URL provided in the response.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error: " + error.message);
            });
    });

    // Generate Mood-Based Playlist (from the Flask code's '/generate-mood-playlist' endpoint)
    moodButton.addEventListener("click", function () {
        const moodSelector = document.getElementById("moodSelector");
        const mood = moodSelector.value; // Get the selected mood dynamically
        console.log("Sending mood:", mood);

        fetch("/generate-mood-playlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mood: mood }), // Send mood as JSON
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse response as JSON
                } else {
                    throw new Error("Failed to generate playlist");
                }
            })
            .then((data) => {
                console.log("Response data:", data);
                if (data.url) {
                    alert("Playlist generated! You can listen to it here: " + data.url);
                    window.location.href = data.url; // Redirect to Spotify playlist URL
                } else {
                    alert("Error: " + (data.error || "An unknown error occurred."));
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error: " + error.message);
            });
    });

    // Emotion Detection and Playlist Generation
    detectEmotionButton.addEventListener("click", function () {
        fetch("/detect-and-generate", {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    // Handle Spotify login redirection if unauthorized (401)
                    return response.json().then((data) => {
                        if (data.redirect_url) {
                            alert("Redirecting to Spotify login...");
                            window.location.href = data.redirect_url;
                        } else {
                            throw new Error("Authentication required, but no redirect URL provided.");
                        }
                    });
                } else {
                    throw new Error("Failed to detect emotion and generate playlist");
                }
            })
            .then((data) => {
                console.log("Response data:", data);

                // Check if playlist_url exists in the response
                if (data.playlist_url) {
                    alert("Playlist created successfully! You can listen to it here: " + data.playlist_url);
                    window.location.href = data.playlist_url; // Redirect to Spotify playlist URL
                } else if (data.error) {
                    alert("Error: " + data.error);
                } else {
                    alert("An unknown error occurred. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred: " + error.message);
            });
    });

    // Function to generate a mood playlist based on detected emotion
    function generateMoodPlaylist(mood) {
        console.log("Automatically generating mood playlist for:", mood);

        fetch("/generate-mood-playlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mood: mood }), // Send mood as JSON
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse response as JSON
                } else {
                    throw new Error("Failed to generate mood playlist");
                }
            })
            .then((data) => {
                if (data.url) {
                    alert("Playlist Generated: " + data.message);
                    window.location.href = data.url; // Redirect to Spotify playlist URL
                } else {
                    alert("Error: " + (data.error || "An unknown error occurred."));
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error: " + error.message);
            });
    }
});
