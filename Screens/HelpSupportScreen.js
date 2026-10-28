// Screens/HelpSupportScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const HelpSupportScreen = ({ navigation }) => {
  const handleEmail = async () => {
    const url = 'mailto:support@furevercare.com?subject=FurEverCare%20Support';

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Can't open mail app on this device.");
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to open mail app.');
      console.log('Email link error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#5a3d2b" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help & Support</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Body text */}
      <Text style={styles.text}>
        For FAQs, tips, and emergency guides, check the Help section or contact support.
      </Text>

      {/* Email button */}
      <TouchableOpacity style={styles.button} onPress={handleEmail}>
        <Text style={styles.buttonText}>Email Support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#5a3d2b' },
  text: { marginTop: 24, fontSize: 14, color: '#7b6652' },
  button: {
    marginTop: 16,
    backgroundColor: '#8b5e3c',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default HelpSupportScreen;
