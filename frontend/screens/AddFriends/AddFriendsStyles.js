import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C', // Dark background color
    paddingHorizontal: 16,
    paddingTop: 60, // Adjusted top padding for header space
  },
  header: {
    marginBottom: 24, // Increased space for header
    flexDirection: 'row', // Ensures the title and search bar are in one row
    justifyContent: 'space-between', // Spaces title and search bar evenly
    alignItems: 'center',
  },
  title: {
    fontSize: 28, // Larger title for "Users"
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333', // Darker background for the search bar
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 20, // Added margin to separate from title
    marginTop: 30, // Adjust this value to drop the search bar further down
  },
  searchIcon: {
    marginRight: 10,
    color: '#B0B0B0', // Light gray color for the icon
  },
  searchBar: {
    height: 50, // Increased height for a wider search bar
    flex: 1,
    color: '#FFFFFF', // White text color
    fontSize: 16,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingVertical: 16,
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 12,
  },
  friendText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  addFriendButton: {
    backgroundColor: '#008B8B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addFriendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  noResultsText: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  alreadySentBox: {
    backgroundColor: '#008B8B',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadySentBoxText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust this value based on your design
    left: 16,
    zIndex: 1,
  },
});

export default styles;

