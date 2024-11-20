document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript file loaded!");

    const randomButton = document.querySelector("form[action='/generate-random-playlist'] button");
    const moodButton = document.getElementById("generateMoodPlaylist");

    // Generate Random Playlist
    randomButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        fetch("/generate-random-playlist", {
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
                window.location.href = data.url; // Redirect to Spotify playlist URL
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error: " + error.message);
            });
    });

    // Generate Mood-Based Playlist
    moodButton.addEventListener("click", function () {
        const mood = "sad"; // Replace with dynamic mood when AI is integrated
        console.log("Sending mood:", mood);

        fetch("/generate-mood-playlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mood: mood }),
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
                window.location.href = data.url; // Redirect to Spotify playlist URL
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error: " + error.message);
            });
    });
});

document.getElementById("detectEmotion").addEventListener("click", function () {
    fetch("/detect-emotion", {
        method: "POST",
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to detect emotion");
            }
        })
        .then((data) => {
            if (data.emotion) {
                alert("Detected Emotion: " + data.emotion);
                console.log("Emotion:", data.emotion);

                // Here, you can automatically generate a mood playlist based on the detected emotion
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred: " + error.message);
        });
});

if (data.emotion) {
    // Generate a mood playlist automatically
    fetch("/generate-mood-playlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood: data.emotion }),
    })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Failed to generate mood playlist");
            }
        })
        .then((data) => {
            alert("Playlist Generated: " + data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
