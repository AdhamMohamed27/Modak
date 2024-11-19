import cv2
import time
from deepface import DeepFace

# Load face cascade classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Start capturing video
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Camera could not be opened.")
else:
    print("Camera opened successfully. Displaying live feed...")

    # Start time
    start_time = time.time()

    captured_frame = None
    while True:
        # Read a frame from the live feed
        ret, frame = cap.read()

        if not ret:
            print("Failed to capture frame.")
            break

        # Display the live feed
        cv2.imshow('Live Feed', frame)

        # Check if the delay time has passed (2 seconds in this case)
        if time.time() - start_time >= 2:
            captured_frame = frame  # Save the current frame
            break

        # Exit if the user presses 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Process the captured frame
    if captured_frame is not None:
        gray_frame = cv2.cvtColor(captured_frame, cv2.COLOR_BGR2GRAY)
        rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

        if len(faces) > 0:
            # Sort faces by size (area) and select the largest one
            largest_face = max(faces, key=lambda rect: rect[2] * rect[3])  # Sort by width * height
            x, y, w, h = largest_face

            # Extract the face ROI (Region of Interest)
            face_roi = rgb_frame[y:y + h, x:x + w]

            # Perform emotion analysis on the face ROI
            result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)

            # Determine the dominant emotion
            emotion = result[0]['dominant_emotion']
            print(f"Detected emotion: {emotion}")

            # Draw rectangle around the largest face and label with predicted emotion
            cv2.rectangle(captured_frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(captured_frame, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

        # Display the processed frame
        cv2.imshow('Emotion Detection', captured_frame)
        cv2.waitKey(0)

# Release the capture and close all windows
cap.release()
cv2.destroyAllWindows()
