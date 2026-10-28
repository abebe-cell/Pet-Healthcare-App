// Screens/SignUpScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../App'; // adjust path if needed

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear inputs when user navigates back to signup
  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
      setRepeatPassword('');
    }, [])
  );

  const handleSignUp = async () => {
    if (!email || !password || !repeatPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }
    if (password !== repeatPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Sign up failed', error.message);
        return;
      }

      // Depending on your Supabase email confirmation settings:
      // - If email confirmation is off, session will be set and you can go to Dashboard.
      // - If confirmation is on, session may be null until user confirms.
      if (session) {
        navigation.replace('DashboardScreen');
      } else {
        Alert.alert(
          'Check your email',
          'We have sent you a confirmation link. Please verify your email before logging in.'
        );
        navigation.replace('LoginScreen');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while signing up.');
      console.log('Sign-up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/MPLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#8b5e3c"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#8b5e3c"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat password"
        placeholderTextColor="#8b5e3c"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'SIGNING UP...' : 'SIGN UP'}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By clicking "Register", you agree to the{' '}
        <Text style={styles.linkText}>Terms of Use</Text>.
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('LoginScreen')}
        style={styles.backToLogin}
      >
        <Text style={styles.backText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logo: { width: 224, height: 129, marginBottom: 20 },
  title: { fontSize: 22, color: '#5a3d2b', fontWeight: 'bold', marginBottom: 25 },
  input: {
    width: '100%',
    backgroundColor: '#f8f5f2',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0d5c6',
    color: '#4a2f20',
  },
  button: {
    width: '100%',
    backgroundColor: '#8b5e3c',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  footerText: {
    marginTop: 15,
    color: '#7a6a58',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  linkText: { color: '#8b5e3c', fontWeight: 'bold' },
  backToLogin: { marginTop: 20 },
  backText: { color: '#8b5e3c', fontWeight: '600' },
});

export default SignUpScreen;
