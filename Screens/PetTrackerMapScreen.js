// Quick placeholder for PetTrackerMapScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const PetTrackerMapScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#5a3d2b" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>
          Pet Tracker Map (Coming Soon)
        </Text>
        <Text>Full Google Maps integration will be here!</Text>
      </View>
    </SafeAreaView>
  );
};

export default PetTrackerMapScreen;
