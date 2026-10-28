import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../App';

const PetTrackerRegistrationScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [gpsDeviceId, setGpsDeviceId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  // Load pets without GPS trackers
  const loadUserPets = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Login Required', 'Please log in to register pets.');
        navigation.goBack();
        return;
      }

      const { data, error } = await supabase
        .from('pets')
        .select('id, name, type, has_gps_tracker')
        .eq('owner_id', user.id)
        .or('has_gps_tracker.is.null,has_gps_tracker.eq.false');

      if (error) {
        Alert.alert('Error', 'Failed to fetch pets');
        console.error('Load pets error:', error);
        return;
      }

      setPets(data || []);
    } catch (err) {
      console.error('Load pets error:', err);
      Alert.alert('Error', 'Failed to load your pets.');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  // Register GPS device to the selected pet
  const handleRegisterGps = useCallback(async () => {
    if (!selectedPetId) {
      Alert.alert('Select Pet', 'Please select a pet to register GPS device.');
      return;
    }
    if (!gpsDeviceId.trim()) {
      Alert.alert('Enter GPS Device ID', 'Please enter the GPS device ID.');
      return;
    }

    setRegistering(true);
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          has_gps_tracker: true,
          gps_device_id: gpsDeviceId.trim(),
          last_tracked_at: new Date().toISOString(),
        })
        .eq('id', selectedPetId);

      if (error) {
        Alert.alert('Registration Failed', error.message);
        return;
      }

      Alert.alert(
        'Success!',
        'GPS device registered successfully!',
        [{ text: 'Done', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to register GPS device.');
      console.error(err);
    } finally {
      setRegistering(false);
    }
  }, [selectedPetId, gpsDeviceId, navigation]);

  useEffect(() => {
    loadUserPets();
  }, [loadUserPets]);

  if (loading) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.loadingText}>Loading your pets...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Register GPS Device</Text>

        <Text style={styles.label}>Select Pet:</Text>
        {pets.length === 0 && (
          <Text style={styles.noPetsText}>No pets available for GPS registration.</Text>
        )}
        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            style={[
              styles.petItem,
              selectedPetId === pet.id && styles.petItemSelected,
            ]}
            onPress={() => setSelectedPetId(pet.id)}
          >
            <Feather
              name={selectedPetId === pet.id ? "check-circle" : "circle"}
              size={24}
              color={selectedPetId === pet.id ? "#2e7d32" : "#666"}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petType}>{pet.type}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>GPS Device ID:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter device ID"
          value={gpsDeviceId}
          onChangeText={setGpsDeviceId}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, registering && { opacity: 0.6 }]}
          onPress={handleRegisterGps}
          disabled={registering}
        >
          <Text style={styles.buttonText}>
            {registering ? "Registering..." : "Register GPS Device"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5a3d2b',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#7b6652',
    fontWeight: '600',
    marginBottom: 12,
  },
  noPetsText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  petItemSelected: {
    borderColor: '#2e7d32',
    backgroundColor: '#dcedc8',
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  petType: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PetTrackerRegistrationScreen;
