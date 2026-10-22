import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e6ee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1F2A44',
  },

  subtitle: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 40,
  },

  button: {
    backgroundColor: '#8971d3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});