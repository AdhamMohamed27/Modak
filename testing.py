import cv2
from deepface import DeepFace
import os

# Path to directory containing images for testing
image_dir = 'train/fear'

# Check if the directory exists and contains files
if not os.path.exists(image_dir):
    print(f"Directory '{image_dir}' does not exist.")
else:
    print(f"Directory '{image_dir}' found.")

    # List all files in the directory
    files = os.listdir(image_dir)
    if not files:
        print(f"No files found in directory '{image_dir}'.")
    else:
        print(f"Files found in directory '{image_dir}': {files}")

    # Load face cascade classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Initialize counters
    total_images = 0
    happy_detected_count = 0

    # Loop through each image in the directory
    for filename in files:
        if filename.endswith(".jpg") or filename.endswith(".png"):  # add other formats if needed
            # Load the image
            image_path = os.path.join(image_dir, filename)
            frame = cv2.imread(image_path)

            # Check if the image is loaded successfully
            if frame is None:
                print(f"Failed to load image: {filename}")
                continue
            else:
                print(f"Successfully loaded image: {filename}")

            total_images += 1  # Increment total image counter

            # Convert frame to grayscale
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Convert grayscale frame to RGB format
            rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)

            # Detect faces in the frame
            faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            if len(faces) == 0:
                print(f"No faces detected in image: {filename}")
            else:
                # Process each detected face
                for (x, y, w, h) in faces:
                    # Extract the face ROI (Region of Interest)
                    face_roi = rgb_frame[y:y + h, x:x + w]

                    # Perform emotion analysis on the face ROI
                    result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)

                    # Determine the dominant emotion
                    emotion = result[0]['dominant_emotion']

                    # Print the filename and detected emotion
                    print(f"Image: {filename}, Detected Emotion: {emotion}")

                    # Check if the detected emotion is "happy"
                    if emotion == "fear":
                        happy_detected_count += 1

    # Calculate and print success rate
    if total_images > 0:
        success_rate = (happy_detected_count / total_images) * 100
        print(f"Success Rate for detecting angry emotion: {success_rate:.2f}%")
    else:
        print("No images processed.")
