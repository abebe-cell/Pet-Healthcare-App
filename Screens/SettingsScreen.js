import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../App';

const SettingsScreen = ({ navigation, darkModeEnabled, setDarkModeEnabled }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
            } catch (error) {
              console.error('Logout error:', error);
            }
            navigation.reset({
              index: 0,
              routes: [{ name: 'SplashLoginScreen' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#5a3d2b" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.rowItem}>
          <View>
            <Text style={styles.itemTitle}>Notifications</Text>
            <Text style={styles.itemSubtitle}>Get reminders and health tips</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? '#8b5e3c' : '#f4f3f4'}
          />
        </View>
        <View style={styles.rowItem}>
          <View>
            <Text style={styles.itemTitle}>Dark Mode</Text>
            <Text style={styles.itemSubtitle}>Reduce eye strain at night</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            thumbColor={darkModeEnabled ? '#8b5e3c' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('ProfileScreen')}>
          <View>
            <Text style={styles.itemTitle}>Edit Profile</Text>
            <Text style={styles.itemSubtitle}>Update your info and pets</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#7b6652" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('HelpSupportScreen')}>
          <View>
            <Text style={styles.itemTitle}>Help & Support</Text>
            <Text style={styles.itemSubtitle}>FAQs and contact support</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#7b6652" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity style={[styles.rowItem, styles.logoutRow]} onPress={handleLogout} activeOpacity={0.7}>
          <View>
            <Text style={[styles.itemTitle, styles.logoutText]}>Log out</Text>
            <Text style={styles.itemSubtitle}>Sign out of FurEverCare</Text>
          </View>
          <Feather name="log-out" size={20} color="#b63e3e" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#5a3d2b' },
  section: { marginTop: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e5ded6', padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#5a3d2b', marginBottom: 12 },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  logoutRow: { borderTopWidth: 1, borderTopColor: '#fee', paddingTop: 12, marginTop: 8 },
  itemTitle: { fontSize: 14, fontWeight: 'bold', color: '#5a3d2b' },
  logoutText: { color: '#b63e3e' },
  itemSubtitle: { fontSize: 12, color: '#7b6652', marginTop: 2 },
});

export default SettingsScreen;
