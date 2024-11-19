import cv2
import numpy as np
from deepface import DeepFace

# Load face cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def analyze_emotion(image_path):
    try:
        # Load the image from the specified path
        img = cv2.imread(image_path)

        if img is None:
            print("Error: Image not found or invalid image format.")
            return

        # Convert the image to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

        if len(faces) > 0:
            # Select the largest face
            x, y, w, h = max(faces, key=lambda rect: rect[2] * rect[3])

            # Crop the face region
            face_roi = img[y:y+h, x:x+w]

            # Analyze the face for emotions
            result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
            # Print the dominant emotion
            print(f"Detected Emotion: {result[0]['dominant_emotion']}")
        else:
            print("No face detected in the image.")

    except Exception as e:
        print(f"Error: {str(e)}")

# Directory of the image
#image_path = "/Users/malekfarouk/PycharmProjects/try1/train/Angry/malek.jpg"  # Update filename if needed
#analyze_emotion(image_path)