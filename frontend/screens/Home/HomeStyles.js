import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  header: {
    paddingTop: 60, // Extends background color upwards
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
  recommendedSection: {
    flex: 1,
    margin: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 4,
  },
  playButton: {
    padding: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingVertical: 12,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  emotionContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  emotionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
