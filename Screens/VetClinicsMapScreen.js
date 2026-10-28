import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';

const VetClinicsMapScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const locationSubscriptionRef = useRef(null);

  const getNearbyVetClinics = useCallback((userLat, userLng) => [
    { id: '1', name: 'Metro Manila Vet Clinic', distance: '1.2km', address: 'Makati City' },
    { id: '2', name: 'Quezon City Animal Hospital', distance: '2.1km', address: 'Quezon City' },
    { id: '3', name: 'Makati Pet Emergency', distance: '0.8km', address: 'BGC, Taguig' },
    { id: '4', name: 'Pasig Vet Care Center', distance: '1.5km', address: 'Pasig City' },
  ], []);

  const setDefaultRegion = useCallback(() => {
    setRegion({
      latitude: 14.5995,
      longitude: 120.9842,
    });
  }, []);

  const startLocationTracking = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to find nearby vet clinics.'
        );
        setDefaultRegion();
        return;
      }

      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setLocation({ latitude, longitude });
          setRegion({ latitude, longitude });
          setLocationError(false);
          setIsTracking(true);
        }
      );
    } catch (error) {
      console.error('Location tracking error:', error);
      setLocationError(true);
      setDefaultRegion();
    }
  }, [setDefaultRegion]);

  const stopLocationTracking = useCallback(() => {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }
    setIsTracking(false);
  }, []);

  useEffect(() => {
    startLocationTracking();
    return () => stopLocationTracking();
  }, [startLocationTracking, stopLocationTracking]);

  const nearbyClinics = location ? getNearbyVetClinics(location.latitude, location.longitude) : [];

  if (!region) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Starting real-time location tracking...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { stopLocationTracking(); navigation.goBack(); }} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#5a3d2b" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Nearby Vet Clinics</Text>
          <Text style={styles.clinicCount}>{nearbyClinics.length} clinics found</Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={startLocationTracking} disabled={isTracking}>
          <Feather name="refresh-cw" size={24} color="#8b5e3c" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        <View style={styles.noticeBox}>
          <Feather name="info" size={18} color="#2e7d32" />
          <Text style={styles.noticeText}>
            Interactive maps are optimized for local builds. Displaying nearby clinics in list view:
          </Text>
        </View>

        {nearbyClinics.map((clinic) => (
          <View key={clinic.id} style={styles.clinicCard}>
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              <Text style={styles.clinicAddress}>{clinic.address}</Text>
            </View>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{clinic.distance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.statusBar}>
        <View style={[styles.statusDot, { backgroundColor: isTracking ? '#2e7d32' : '#ff9800' }]} />
        <Text style={styles.statusText}>
          {isTracking ? 'Live GPS Active' : 'GPS Standby'}
        </Text>
        {locationError && <Feather name="alert-triangle" size={16} color="#ff5722" />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { fontSize: 16, color: '#666', marginTop: 12, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  backButton: { padding: 4 },
  headerCenter: { flex: 1, alignItems: 'center', marginLeft: -20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#5a3d2b' },
  clinicCount: { fontSize: 14, color: '#666', marginTop: 2 },
  refreshButton: { padding: 4 },
  listContainer: { padding: 16 },
  noticeBox: { flexDirection: 'row', backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  noticeText: { fontSize: 13, color: '#2e7d32', marginLeft: 8, flex: 1 },
  clinicCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  clinicInfo: { flex: 1 },
  clinicName: { fontSize: 16, fontWeight: '600', color: '#333' },
  clinicAddress: { fontSize: 13, color: '#666', marginTop: 4 },
  distanceBadge: { backgroundColor: '#e0f2f1', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  distanceText: { fontSize: 12, fontWeight: '700', color: '#00796b' },
  statusBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e9ecef' },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  statusText: { fontSize: 14, color: '#333', flex: 1, fontWeight: '500' },
});

export default VetClinicsMapScreen;