import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F6F6FB',
  },

  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2A44',
    marginTop: 10,
  },

  subtitle: {
    textAlign: 'center',
    color: '#8A8A8A',
    marginBottom: 25,
    fontSize: 14,
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    color: '#444',
    fontWeight: '500',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, 
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },

  button: {
    backgroundColor: '#8971d3',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#8971d3',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3, 
  },

  buttonDisabled: {
    backgroundColor: '#C5C5C5',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },

  error: {
    color: '#FF4D4D',
    marginBottom: 10,
    textAlign: 'center',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 12,
  },

  googleButton: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },

  googleText: {
    color: '#444',
    fontWeight: '600',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#666',
  },

  link: {
    color: '#8971d3',
    fontWeight: 'bold',
  },
});