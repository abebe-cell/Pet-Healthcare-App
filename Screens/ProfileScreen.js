import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../App';

const onlyLettersRegex = /^[A-Za-z\s]*$/;
const onlyDigitsRegex = /^[0-9]*$/;

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [pets, setPets] = useState([]);
  const [originalPets, setOriginalPets] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('');
  const [newPetAge, setNewPetAge] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'No logged-in user.');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setName(profile.full_name || '');
        setEmail(profile.email || user.email || '');
        setParentPhone(profile.phone || '');
        setParentAddress(profile.address || '');
        setMemberSince(profile.member_since || '');
      } else {
        setEmail(user.email || '');
      }

      // ✅ FIXED: Use owner_id instead of user_id
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)  // Changed from user_id
        .order('name', { ascending: true });

      if (petsError) {
        console.error('Error loading pets:', petsError);
        Alert.alert('Error', `Failed to load pets: ${petsError.message}`);
        return;
      }

      if (petsData && petsData.length > 0) {
        // ✅ FIXED: Use type column (matches your Supabase schema)
        const petsList = petsData.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type || p.species || 'Pet',  // Prefer type column
          age: String(p.age ?? '0'),
          isNew: false,
        }));
        setPets(petsList);
        setOriginalPets(petsList);
      } else {
        setPets([]);
        setOriginalPets([]);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Not logged in', 'Please log in again.');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name.trim(),
          phone: parentPhone.trim(),
          address: parentAddress.trim(),
          member_since: memberSince.trim(),
        }, { onConflict: 'id' });

      if (profileError) {
        Alert.alert('Error', `Could not save profile details: ${profileError.message}`);
        return;
      }

      const originalPetIds = originalPets.map(p => p.id);
      const currentPetIds = pets.filter(p => !p.isNew).map(p => p.id);
      const deletedPetIds = originalPetIds.filter(id => !currentPetIds.includes(id));

      if (deletedPetIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('pets')
          .delete()
          .in('id', deletedPetIds);

        if (deleteError) {
          Alert.alert('Error', `Could not delete pets: ${deleteError.message}`);
          return;
        }
      }

      // ✅ FIXED: Update existing pets using 'type' column and 'owner_id'
      for (const pet of pets) {
        if (!pet.isNew) {
          const { error: updateError } = await supabase
            .from('pets')
            .update({
              name: pet.name,
              type: pet.type,  // Changed from species ✅
              age: Number(pet.age || 0),
            })
            .eq('id', pet.id);

          if (updateError) {
            console.error('Error updating pet:', updateError);
            Alert.alert('Warning', `Could not update pet ${pet.name}: ${updateError.message}`);
          }
        }
      }

      // ✅ FIXED: Insert new pets using 'type' and 'owner_id'
      const newPets = pets.filter(p => p.isNew);
      if (newPets.length > 0) {
        const newPetsPayload = newPets.map(p => ({
          owner_id: user.id,  // Changed from user_id ✅
          name: p.name,
          type: p.type,       // Changed from species ✅
          age: Number(p.age || 0),
          has_gps_tracker: false,
        }));

        const { error: insertError } = await supabase
          .from('pets')
          .insert(newPetsPayload);

        if (insertError) {
          Alert.alert('Error', `Could not save new pets: ${insertError.message}`);
          console.error('Insert error details:', insertError); // Better logging
          return;
        }
      }

      Alert.alert('Saved', 'Your profile and pets have been updated!');
      setIsEditing(false);

      // ✅ FIXED: Refresh pets using owner_id
      const { data: updatedPets } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)  // Changed from user_id ✅
        .order('name', { ascending: true });

      if (updatedPets && updatedPets.length > 0) {
        const petsList = updatedPets.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type || p.species || 'Pet',
          age: String(p.age ?? '0'),
          isNew: false,
        }));
        setPets(petsList);
        setOriginalPets(petsList);
      } else {
        setPets([]);
        setOriginalPets([]);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while saving.');
      console.error('handleSave full error:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPets(originalPets);
    setNewPetName('');
    setNewPetType('');
    setNewPetAge('');
  };

  const handleAddPet = () => {
    if (!newPetName.trim() || !newPetType.trim() || !newPetAge.trim()) {
      Alert.alert('Missing info', 'Please fill in all pet fields.');
      return;
    }
    if (!onlyDigitsRegex.test(newPetAge)) {
      Alert.alert('Invalid age', 'Age must be whole numbers only.');
      return;
    }
    const newPet = {
      id: 'temp_' + Date.now(),
      name: newPetName.trim(),
      type: newPetType.trim(),
      age: newPetAge.trim(),
      isNew: true,
    };
    setPets(prev => [...prev, newPet]);
    setNewPetName('');
    setNewPetType('');
    setNewPetAge('');
  };

  const handleRemovePet = (id) => {
    setPets(prev => prev.filter(p => p.id !== id));
  };

  const onChangeName = (text) => {
    if (onlyLettersRegex.test(text)) setName(text);
  };
  const onChangeNewPetName = (text) => {
    if (onlyLettersRegex.test(text)) setNewPetName(text);
  };
  const onChangeNewPetType = (text) => {
    if (onlyLettersRegex.test(text)) setNewPetType(text);
  };
  const onChangeNewPetAge = (text) => {
    if (onlyDigitsRegex.test(text)) setNewPetAge(text);
  };
  const onChangeMemberSince = (text) => {
    if (onlyDigitsRegex.test(text)) setMemberSince(text);
  };
  const onChangeParentPhone = (text) => {
    if (onlyDigitsRegex.test(text)) setParentPhone(text);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#5a3d2b" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
          {isEditing ? (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleCancel} style={{ marginRight: 8 }}>
                <Text style={styles.headerActionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.headerActionText, { color: '#8b5e3c' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={[styles.headerActionText, { color: '#8b5e3c' }]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.center}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={40} color="#fff" />
          </View>
          {isEditing ? (
            <>
              <TextInput
                style={[styles.textInputBase, styles.nameInput]}
                value={name}
                onChangeText={onChangeName}
                placeholder="Name"
                placeholderTextColor="#b3a89c"
              />
              <TextInput
                style={[styles.textInputBase, styles.emailInput]}
                value={email}
                placeholder="Email"
                placeholderTextColor="#b3a89c"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
            </>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Parent information</Text>
          {isEditing ? (
            <>
              <Text style={styles.infoLabel}>Phone number</Text>
              <TextInput
                style={[styles.textInputBase, styles.input]}
                value={parentPhone}
                onChangeText={onChangeParentPhone}
                keyboardType="phone-pad"
                placeholder="Phone number"
                placeholderTextColor="#b3a89c"
              />
              <Text style={[styles.infoLabel, { marginTop: 8 }]}>Address</Text>
              <TextInput
                style={[styles.textInputBase, styles.input, { height: 70, textAlignVertical: 'top' }]}
                value={parentAddress}
                onChangeText={setParentAddress}
                multiline
                placeholder="Address"
                placeholderTextColor="#b3a89c"
              />
            </>
          ) : (
            <>
              <Text style={styles.infoText}>Phone: {parentPhone}</Text>
              <Text style={styles.infoText}>Address: {parentAddress}</Text>
            </>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your pets</Text>
          <View>
            {pets.map((item) => (
              <View key={item.id} style={styles.petRow}>
                <View>
                  {isEditing ? (
                    <>
                      <Text style={styles.petName}>
                        {item.name} {item.isNew && <Text style={{ color: '#2e7d32' }}>(new)</Text>}
                      </Text>
                      <Text style={styles.petDetails}>
                        {item.type}, {item.age} years
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.petName}>
                      • {item.name} ({item.type}, {item.age} years)
                    </Text>
                  )}
                </View>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleRemovePet(item.id)}>
                    <Feather name="trash-2" size={18} color="#b63e3e" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {isEditing && (
            <View style={styles.addPetContainer}>
              <Text style={styles.addPetTitle}>Add new pet</Text>
              <TextInput
                style={[styles.textInputBase, styles.input]}
                placeholder="Name"
                placeholderTextColor="#b3a89c"
                value={newPetName}
                onChangeText={onChangeNewPetName}
              />
              <TextInput
                style={[styles.textInputBase, styles.input]}
                placeholder="Type (Dog, Cat...)"
                placeholderTextColor="#b3a89c"
                value={newPetType}
                onChangeText={onChangeNewPetType}
              />
              <TextInput
                style={[styles.textInputBase, styles.input]}
                placeholder="Age (years, whole numbers)"
                placeholderTextColor="#b3a89c"
                value={newPetAge}
                onChangeText={onChangeNewPetAge}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.addPetButton} onPress={handleAddPet}>
                <Text style={styles.addPetButtonText}>Add Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Account</Text>
          <View style={{ marginTop: 4 }}>
            {isEditing ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.infoLabel}>Member since: </Text>
                <TextInput
                  style={[styles.textInputBase, styles.input, { flex: 0, width: 80, marginTop: 0 }]}
                  value={memberSince}
                  onChangeText={onChangeMemberSince}
                  keyboardType="number-pad"
                  placeholderTextColor="#b3a89c"
                />
              </View>
            ) : (
              <Text style={styles.infoText}>Member since {memberSince}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerActionText: { fontSize: 14, fontWeight: '600', color: '#5a3d2b' },

  center: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#8b5e3c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#5a3d2b' },
  email: { fontSize: 14, color: '#7b6652', marginTop: 4 },

  textInputBase: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cdbfb0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#3d2b1f',
  },
  nameInput: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  emailInput: { fontSize: 14, marginTop: 6, backgroundColor: '#f5f5f5' },

  infoCard: { borderRadius: 14, borderWidth: 1, borderColor: '#e5ded6', padding: 16, marginBottom: 12 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#5a3d2b', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#7b6652', marginTop: 2 },
  infoLabel: { fontSize: 13, color: '#7b6652' },

  petRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  petName: { fontSize: 14, color: '#7b6652' },
  petDetails: { fontSize: 12, color: '#a08f7a' },

  addPetContainer: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  addPetTitle: { fontSize: 14, fontWeight: '600', color: '#5a3d2b', marginBottom: 6 },
  input: { fontSize: 13, marginTop: 6 },
  addPetButton: { backgroundColor: '#8b5e3c', borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
  addPetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default ProfileScreen;
