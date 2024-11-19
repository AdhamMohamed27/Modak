import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 80, // Adjust to account for back arrow spacing
  },
  button: {
    backgroundColor: '#008B8B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 8,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
