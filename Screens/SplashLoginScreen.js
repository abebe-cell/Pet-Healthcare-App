import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const SplashLoginScreen = ({ navigation }) => {
  return (
     <View style={styles.container}>
      <Image
        source={require('../assets/MPLogo.png')}
        style={styles.logo}
        resizeMode="contain" // or "cover" for cropped zoom
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ece4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 224,
    height: 129,
    marginBottom: 25,
  },

  button: {
    backgroundColor: '#8b5e3c',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SplashLoginScreen;
