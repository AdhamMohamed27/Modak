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
    left: 20,
  },
  header: {
    marginTop: 50, // Adjusted spacing to avoid overlap with notification panel
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#444444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userDetails: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  settingsButton: {
    marginTop: 32,
    backgroundColor: '#444444',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  settingsText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
export default styles;
