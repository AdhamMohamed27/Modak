import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C', // Dark background
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for the title
    marginBottom: 16,
    marginTop: 35, // Add top margin to create space below the arrow
    textAlign: 'left', // Optional: center-align the title
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333', // Dark background for each request
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row', // Align profile pic and username horizontally
    alignItems: 'center',
    flex: 1, // Take most of the space in the container
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circle shape for profile picture
    marginRight: 10,
  },
  friendText: {
    color: '#FFFFFF', // White text for friend's username
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row', // Align buttons horizontally
  },
  acceptButton: {
    backgroundColor: '#008B8B', // Teal color for Accept button
    width: 50, // Fixed width for uniform square shape
    height: 50, // Fixed height
    borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    marginRight: 8, // Space between buttons
  },
  acceptButtonText: {
    color: '#FFFFFF', // White text for Accept button
    fontSize: 25, // Larger size for better visibility
    fontWeight: 'bold', // Bold text for emphasis
    textAlign: 'center',
  },
  denyButton: {
    backgroundColor: '#4C4C4C', // Grey color for Deny button
    width: 50, // Fixed width for uniform square shape
    height: 50, // Fixed height
    borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
  denyButtonText: {
    color: '#FFFFFF', // White text for Deny button
    fontSize: 30, // Larger size for better visibility
    fontWeight: 'bold', // Bold text for emphasis
    textAlign: 'center',
    fontFamily: 'Arial', // Ensure a consistent font family on iOS
  },
  backButton: {
    position: 'absolute',
    top: 60, // Adjust the top position to place it correctly
    left: 16,
    zIndex: 1,
  },
  noRequestsText: {
    fontSize: 18, // Size for "No Requests"
    fontWeight: 'bold', // Bold text
    color: '#FFFFFF', // White text
    textAlign: 'center', // Center aligned
    marginTop: 50, // Space from the top or previous content
  },
});

export default styles;
