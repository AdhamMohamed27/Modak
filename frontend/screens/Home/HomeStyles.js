import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    justifyContent: 'space-between',
    paddingBottom: 300, // Ensure there's enough space for the bottom bar
  },

  // Profile Section Styling
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    color: '#B0B0B0',
    fontSize: 14,
  },

  // Enlarged Spotify Circle Styling
  spotifyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  spotifyCircle: {
    backgroundColor: '#1DB954', // Spotify Green
    width: 150, // Increased size
    height: 150, // Increased size
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Adds subtle shadow
  },
  spotifyLogo: {
    width: 75, // Increased size
    height: 75, // Increased size
  },

  // Link Account Box Styling
  linkAccountBox: {
    position: 'absolute',
    right: -50, // Slight overlap on the right
    top: 45, // Position it slightly above the circle
    backgroundColor: '#333333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  linkAccountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Bottom Playlist Boxes Styling
  playlistBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  playlistBox: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 10,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8, // Adds shadow for Android
  },
  boxText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },

  // Bottom Bar Styling
 bottomBar: {
   position: 'absolute',  // Fixes the bar at the bottom
   bottom: 0,             // Positions it at the bottom of the screen
   width: '100%',         // Ensures it spans the full width of the screen
   flexDirection: 'row',
   justifyContent: 'space-around',
   alignItems: 'center',
   backgroundColor: '#333333',
   paddingVertical: 12,
   borderTopWidth: 1,
   borderTopColor: '#444444',
 },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  modalContent: {
    backgroundColor: '#3C3C3C',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  moodButton: {
    backgroundColor: '#008B8B',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  moodButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 18,
  },
});

export default styles;
