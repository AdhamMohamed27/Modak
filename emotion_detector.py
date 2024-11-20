import cv2
import time
from deepface import DeepFace

# Load face cascade classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def detect_emotion():
    """
    Detect emotion using the webcam feed.
    Captures a single frame, detects the largest face, and predicts the dominant emotion.
    Returns the detected emotion or raises an exception if no emotion is detected.
    """
    # Start capturing video
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        raise Exception("Error: Camera could not be opened.")

    print("Camera opened successfully. Displaying live feed...")

    # Start time for delay
    start_time = time.time()

    captured_frame = None
    while True:
        # Read a frame from the live feed
        ret, frame = cap.read()

        if not ret:
            raise Exception("Failed to capture frame.")
        
        # Debug: Save live feed frame for inspection (Optional)
        cv2.imwrite("debug_live_feed_frame.jpg", frame)
        print("Saved live feed frame to debug_live_feed_frame.jpg")

        # Display the live feed (optional for debugging, can be commented out)
        cv2.imshow('Live Feed', frame)

        # Check if the delay time has passed (2 seconds in this case)
        if time.time() - start_time >= 2:
            captured_frame = frame  # Save the current frame
            print("Captured a frame for processing.")
            break

        # Exit if the user presses 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            raise Exception("User exited the live feed.")

    # Process the captured frame
    if captured_frame is not None:
        gray_frame = cv2.cvtColor(captured_frame, cv2.COLOR_BGR2GRAY)
        rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)

        # Debug: Save processed frames for inspection
        cv2.imwrite("debug_gray_frame.jpg", gray_frame)
        print("Saved grayscale frame to debug_gray_frame.jpg")
        cv2.imwrite("debug_rgb_frame.jpg", rgb_frame)
        print("Saved RGB frame to debug_rgb_frame.jpg")

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

        if len(faces) > 0:
            # Sort faces by size (area) and select the largest one
            largest_face = max(faces, key=lambda rect: rect[2] * rect[3])  # Sort by width * height
            x, y, w, h = largest_face

            # Extract the face ROI (Region of Interest)
            face_roi = rgb_frame[y:y + h, x:x + w]

            # Debug: Save the face ROI for inspection
            cv2.imwrite("debug_face_roi.jpg", face_roi)
            print("Saved face ROI to debug_face_roi.jpg")

            # Perform emotion analysis on the face ROI
            try:
                result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                print(f"DeepFace result: {result}")

                # Determine the dominant emotion
                if isinstance(result, list) and len(result) > 0 and 'dominant_emotion' in result[0]:
                    emotion = result[0]['dominant_emotion']
                    print(f"Detected emotion: {emotion}")
                else:
                    raise Exception("Error: 'dominant_emotion' not found in DeepFace result.")
                


                # Release the capture and close all windows
                cap.release()
                cv2.destroyAllWindows()

                return emotion  # Return the detected emotion

            except Exception as e:
                print(f"Error during emotion detection: {e}")
                raise e
        else:
            cap.release()
            cv2.destroyAllWindows()
            raise Exception("No faces detected in the frame.")
    
    else:
        cap.release()
        cv2.destroyAllWindows()
        raise Exception("No frame captured.")

    # Fallback: Release the capture and close all windows
    cap.release()
    cv2.destroyAllWindows()
