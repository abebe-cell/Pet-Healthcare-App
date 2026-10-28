// Screens/LoginScreen.js
import React, { useState, useCallback } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../App';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
    }, [])
  );

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Attempting login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        
        // Better error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email before logging in.';
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        }
        
        Alert.alert('Login Failed', errorMessage);
        return;
      }

      if (data?.session) {
        console.log('Login successful, navigating to dashboard');
        navigation.replace('DashboardScreen');
      } else {
        Alert.alert('Login Failed', 'Unable to create session. Please try again.');
      }
      
    } catch (err) {
      console.error('Sign-in error:', err);
      Alert.alert('Error', 'Cannot connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, welcome to</Text>
      <Text style={styles.brand}>FurEverCare</Text>

      <Image
        source={require('../assets/MPLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        theme={{
          colors: {
            text: '#4a2e0e',
            placeholder: '#8b6b4f',
            primary: '#8b5e3c',
            background: '#f7f3ef',
          },
          roundness: 12,
        }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        theme={{
          colors: {
            text: '#4a2e0e',
            placeholder: '#8b6b4f',
            primary: '#8b5e3c',
            background: '#f7f3ef',
          },
          roundness: 12,
        }}
      />

      <TouchableOpacity style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        style={styles.signInButton}
        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
        onPress={handleSignIn}
        loading={loading}
        disabled={loading}
      >
        SIGN IN
      </Button>

      <View style={styles.footer}>
        <Text style={styles.footerText}>First time here?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.link}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 18, textAlign: 'center', color: '#6b4f33' },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5e3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: { width: 224, height: 129, alignSelf: 'center', marginBottom: 20 },
  input: { marginBottom: 12, backgroundColor: '#f7f3ef' },
  forgotContainer: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#8b5e3c', fontWeight: '600' },
  signInButton: {
    backgroundColor: '#8b5e3c',
    borderRadius: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#6b4f33' },
  link: { color: '#8b5e3c', fontWeight: 'bold' },
});

export default LoginScreen;