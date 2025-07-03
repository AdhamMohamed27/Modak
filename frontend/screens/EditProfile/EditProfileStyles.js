import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 16,
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
  },
  headerText: {
    fontSize: 28,  // Increased font size for the title
    color: '#FFF',
    fontWeight: 'bold',  // Make the title bold
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    position: 'relative', // Ensures the edit icon is positioned relative to the profile picture
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 15,  // Slightly decreased to push it onto the picture
    right: 15,   // Slightly decreased to push it onto the picture
    backgroundColor: '#008B8B',
    borderRadius: 12,
    padding: 6,  // Keeps the icon a bit bigger
  },
  inputSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 18,  // Increased font size for better readability
    color: '#FFF',
    marginBottom: 5,
    fontWeight: 'bold',  // Bold text for labels
  },
  input: {
    backgroundColor: '#3A3A3A',
    padding: 15,  // Increased padding for input fields
    marginBottom: 5,  // Reduced space to bring error closer to the input box
    borderRadius: 5,
    color: '#FFF',
    fontSize: 18,  // Increased font size for inputs
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center', // Center align the error message
    marginBottom: 5, // Reduced space to bring it closer to the input field
  },
  actionButtons: {
    marginTop: 30,
  },
  cancelButton: {
    padding: 15,
    backgroundColor: '#4C4C4C',
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    padding: 15,
    backgroundColor: '#008B8B',
    borderRadius: 5,
    marginBottom: 10,
  },
  actionText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,  // Increased font size for action text
    fontWeight: 'bold',  // Bold text for Save and Cancel buttons
  },
});

export default styles;
