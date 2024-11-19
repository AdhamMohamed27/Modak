from flask import Flask, request, jsonify
import cv2
import numpy as np
from deepface import DeepFace
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Ensure the upload folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load face cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save the uploaded file to the server
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Read the image file
        img = cv2.imread(file_path)

        # Convert to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

        if len(faces) > 0:
            # Select the largest face
            x, y, w, h = max(faces, key=lambda rect: rect[2] * rect[3])

            # Crop the face region
            face_roi = img[y:y + h, x:x + w]

            # Analyze the face for emotions
            result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)

            # Return the dominant emotion
            return jsonify({'emotion': result[0]['dominant_emotion']}), 200
        else:
            return jsonify({'error': 'No face detected'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
