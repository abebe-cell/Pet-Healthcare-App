import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';

const DashboardScreen = ({ navigation }) => {
  const handleTrackPets = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed to track pets.');
        return;
      }

      Alert.alert(
        'GPS Tracking',
        'Searching for GPS collar signals...\n\nFound 2 pets nearby!\n• Bella: 1.2km (North)\n• Milo: 0.8km (East)',
        [
          { text: 'View on Map', onPress: () => navigation.navigate('PetTrackerMapScreen') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      Alert.alert('Tracking Error', 'Unable to access GPS tracking. Please ensure collar devices are active.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <View style={styles.avatarCircle}>
              <Feather name="user" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Feather name="settings" size={22} color="#8b5e3c" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Welcome to FurEverCare 🐶</Text>
      <Text style={styles.subtitle}>
        Your trusted pet care companion — anytime, anywhere.
      </Text>

      {/* GPS Pet Tracker */}
      <View style={[styles.card, styles.trackerCard]}>
        <View style={styles.row}>
          <Feather name="map-pin" size={24} color="#2e7d32" />
          <Text style={[styles.cardTitle, { color: '#2e7d32' }]}>GPS Pet Tracker</Text>
        </View>
        <Text style={styles.cardDesc}>
          Real-time GPS tracking for registered collar devices.
        </Text>
        <TouchableOpacity 
          style={[styles.button, styles.trackerButton]}
          onPress={() => navigation.navigate('PetTrackerScreen')}
        >
          <Text style={styles.buttonText}>Open Tracker</Text>
        </TouchableOpacity>
      </View>

      {/* Nearest Vet Clinic */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Entypo name="location-pin" size={24} color="#8b5e3c" />
          <Text style={styles.cardTitle}>Nearest Vet Clinic</Text>
        </View>
        <Text style={styles.cardDesc}>Find nearby veterinary clinics on the map</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('VetClinicsMapScreen')}
        >
          <Text style={styles.buttonText}>View on Map</Text>
        </TouchableOpacity>
      </View>

      {/* Symptom Checker */}
      <View style={styles.card}>
        <View style={styles.row}>
          <FontAwesome5 name="stethoscope" size={20} color="#8b5e3c" />
          <Text style={styles.cardTitle}>Symptom Checker</Text>
        </View>
        <Text style={styles.cardDesc}>
          Describe your pet's symptoms and get vet-reviewed advice before seeing a professional.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('SymptomCheckerScreen')}
        >
          <Text style={styles.buttonText}>Check Symptoms</Text>
        </TouchableOpacity>
      </View>

      {/* Pet Care Library */}
      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="medical-services" size={22} color="#8b5e3c" />
          <Text style={styles.cardTitle}>Pet Care Library</Text>
        </View>
        <Text style={styles.cardDesc}>
          Access reliable, vet-approved articles on common pet issues, nutrition, and first aid.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('PetCareLibraryScreen')}
        >
          <Text style={styles.buttonText}>Explore Tips</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Hotline */}
      <View style={[styles.card, { borderColor: '#b63e3e' }]}>
        <View style={styles.row}>
          <Feather name="phone-call" size={22} color="#b63e3e" />
          <Text style={[styles.cardTitle, { color: '#b63e3e' }]}>Emergency Hotline</Text>
        </View>
        <Text style={styles.cardDesc}>
          Need immediate help? Contact your nearest emergency vet center.
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#b63e3e' }]}
          onPress={() => Alert.alert('Emergency', 'Calling emergency vet hotline...')}
        >
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
      </View>

      {/* Profile & Settings cards */}
      <View style={styles.rowSplit}>
        <View style={[styles.card, styles.halfCard]}>
          <View style={styles.row}>
            <Feather name="user" size={20} color="#8b5e3c" />
            <Text style={styles.cardTitle}>Profile</Text>
          </View>
          <Text style={styles.cardDesc}>View your details and pets.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Text style={styles.buttonText}>Open Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.halfCard]}>
          <View style={styles.row}>
            <Feather name="settings" size={20} color="#8b5e3c" />
            <Text style={styles.cardTitle}>Settings</Text>
          </View>
          <Text style={styles.cardDesc}>
            Manage notifications and app preferences.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <Text style={styles.buttonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#5a3d2b' },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8b5e3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a3d2b',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    textAlign: 'center',
    color: '#7b6652',
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5ded6',
  },
  trackerCard: {
    borderColor: '#c8e6c9',
    backgroundColor: '#f1f8e9',
    shadowColor: '#2e7d32',
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#8b5e3c', marginLeft: 6 },
  cardDesc: { fontSize: 13, color: '#7b6652', marginBottom: 10 },
  button: {
    backgroundColor: '#8b5e3c',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trackerButton: {
    backgroundColor: '#2e7d32',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  rowSplit: {
    flexDirection: 'row',
    columnGap: 10,
    marginBottom: 20,
  },
  halfCard: {
    flex: 1,
  },
});

export default DashboardScreen;