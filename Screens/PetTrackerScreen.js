import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../App';

const PetTrackerScreen = ({ navigation }) => {
  const [petsRegistered, setPetsRegistered] = useState(false);
  const [petTrackingData, setPetTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoPetsModal, setShowNoPetsModal] = useState(false);

  const checkPetRegistration = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        Alert.alert('Login Required', 'Please log in to track your pets.');
        navigation.goBack();
        return;
      }

      console.log('Checking pets for user:', user.id);

      // First, let's get ALL pets to see what data exists
      const { data: allPets, error: allPetsError } = await supabase
        .from('pets')
        .select('*')
        .limit(1);

      if (allPetsError) {
        console.error('Database error:', allPetsError);
        Alert.alert('Database Error', `Error: ${allPetsError.message}\n\nMake sure the 'pets' table exists in your Supabase database.`);
        return;
      }

      // Log the structure to see what columns exist
      if (allPets && allPets.length > 0) {
        console.log('Available columns in pets table:', Object.keys(allPets[0]));
      }

      // Now fetch the user's pets - try to be flexible with column names
      const { data: userPets, error: petsError } = await supabase
        .from('pets')
        .select('*');

      if (petsError) {
        console.error('Fetch pets error:', petsError);
        Alert.alert('Error', `Failed to load pets: ${petsError.message}`);
        return;
      }

      console.log('All pets from database:', userPets);

      // Filter pets by user (flexible - works with user_id or owner_id)
      const filteredPets = userPets?.filter(pet => 
        pet.user_id === user.id || pet.owner_id === user.id
      ) || [];

      console.log('User pets after filtering:', filteredPets);

      // Further filter by GPS tracker if that column exists
      const petsWithTrackers = filteredPets.filter(pet => {
        // Check if has_gps_tracker column exists and is true
        if ('has_gps_tracker' in pet) {
          return pet.has_gps_tracker === true;
        }
        // If column doesn't exist, check if GPS data exists
        return pet.gps_device_id || pet.microchip_id;
      });

      console.log('Pets with GPS trackers:', petsWithTrackers);
      
      const hasRegistered = petsWithTrackers.length > 0;
      setPetsRegistered(hasRegistered);
      setPetTrackingData(petsWithTrackers);

      if (!hasRegistered) {
        setShowNoPetsModal(true);
      }
    } catch (error) {
      console.error('Registration check error:', error);
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const handleRegisterAnotherPet = useCallback(() => {
    navigation.navigate('PetTrackerRegistrationScreen');
  }, [navigation]);

  // Refresh on screen focus and initial load
  useEffect(() => {
    // Initial load
    checkPetRegistration();

    // Listen for screen focus
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('PetTracker screen focused - refreshing...');
      checkPetRegistration();
    });
    
    return unsubscribe;
  }, [navigation, checkPetRegistration]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10;
  };

  const formatLastSeen = (lastTrackedAt) => {
    if (!lastTrackedAt) return 'Never';
    const now = new Date();
    const tracked = new Date(lastTrackedAt);
    const diffMs = now - tracked;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins/60)}h ago`;
    return `${Math.floor(diffMins/1440)}d ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5e3c" />
          <Text style={styles.loadingText}>Loading pet tracker...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* No Pets Modal */}
      <Modal 
        visible={showNoPetsModal} 
        transparent 
        animationType="fade"
        onRequestClose={() => setShowNoPetsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Feather name="alert-triangle" size={64} color="#8b5e3c" />
            <Text style={styles.modalTitle}>No Registered GPS Pets</Text>
            <Text style={styles.modalDesc}>
              Register your pets with GPS collars to start tracking their location in real-time.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowNoPetsModal(false);
                navigation.navigate('PetTrackerRegistrationScreen');
              }}
            >
              <Text style={styles.modalButtonText}>Register GPS Device</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => {
                setShowNoPetsModal(false);
                navigation.goBack();
              }}
            >
              <Text style={[styles.modalButtonText, styles.modalCancelText]}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color="#5a3d2b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Tracker</Text>
        <TouchableOpacity 
          onPress={checkPetRegistration}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="refresh-cw" size={24} color="#8b5e3c" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {petsRegistered ? (
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.trackingStatus}>
            Live GPS Tracking • {petTrackingData.length} pet{petTrackingData.length !== 1 ? 's' : ''}
          </Text>

          {petTrackingData.map((pet) => {
            // Default user location (Cagayan de Oro)
            const userLat = 8.4542;
            const userLon = 124.6319;
            
            const distance = pet.gps_latitude && pet.gps_longitude 
              ? `${calculateDistance(userLat, userLon, pet.gps_latitude, pet.gps_longitude)}km`
              : 'N/A';

            return (
              <View key={pet.id} style={styles.petCard}>
                <View style={styles.petHeader}>
                  <Text style={styles.petName} numberOfLines={1}>
                    {pet.name || 'Unnamed Pet'}
                  </Text>
                  <View style={styles.statusIndicator} />
                </View>
                <Text style={styles.petType}>
                  {pet.species || pet.type || pet.breed || 'Pet'}
                </Text>
                
                <View style={styles.locationInfo}>
                  <View style={styles.locationRow}>
                    <Feather name="map-pin" size={16} color="#2e7d32" />
                    <Text style={styles.distance}>{distance} away</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Feather name="clock" size={16} color="#666" />
                    <Text style={styles.lastSeen}>
                      {formatLastSeen(pet.last_tracked_at || pet.updated_at)}
                    </Text>
                  </View>
                </View>

                {(pet.gps_device_id || pet.microchip_id) && (
                  <Text style={styles.deviceId}>
                    Device: {pet.gps_device_id || pet.microchip_id}
                  </Text>
                )}

                <TouchableOpacity 
                  style={styles.trackButton} 
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('PetTrackerMapScreen', { pet })}
                >
                  <Feather name="map" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.trackButtonText}>View on Map</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity 
            style={styles.registerAnotherButton}
            activeOpacity={0.7}
            onPress={handleRegisterAnotherPet}
          >
            <Feather name="plus" size={20} color="#8b5e3c" style={styles.registerAnotherIcon} />
            <Text style={styles.registerAnotherText}>Register Another Pet</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="map-pin" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No pets with GPS trackers</Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('PetTrackerRegistrationScreen')}
          >
            <Text style={styles.emptyButtonText}>Register a Pet</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a3d2b',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  trackingStatus: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  petCard: {
    backgroundColor: '#f8f5f2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0d5c6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a3d2b',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2e7d32',
  },
  petType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distance: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 8,
  },
  lastSeen: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  deviceId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  trackButton: {
    backgroundColor: '#8b5e3c',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8b5e3c',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  registerAnotherIcon: {
    marginRight: 8,
  },
  registerAnotherText: {
    color: '#8b5e3c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#8b5e3c',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: '85%',
    width: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a3d2b',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#8b5e3c',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8b5e3c',
  },
  modalCancelText: {
    color: '#8b5e3c',
  },
});

export default PetTrackerScreen;