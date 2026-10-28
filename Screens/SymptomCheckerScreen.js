import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const COMMON_SYMPTOMS = [
  { id: 1, name: 'Vomiting', icon: 'alert-circle', severity: 'medium' },
  { id: 2, name: 'Diarrhea', icon: 'droplet', severity: 'medium' },
  { id: 3, name: 'Lethargy', icon: 'moon', severity: 'medium' },
  { id: 4, name: 'Loss of Appetite', icon: 'x-circle', severity: 'low' },
  { id: 5, name: 'Coughing', icon: 'wind', severity: 'medium' },
  { id: 6, name: 'Sneezing', icon: 'cloud', severity: 'low' },
  { id: 7, name: 'Limping', icon: 'activity', severity: 'medium' },
  { id: 8, name: 'Scratching', icon: 'slash', severity: 'low' },
  { id: 9, name: 'Seizures', icon: 'zap', severity: 'high' },
  { id: 10, name: 'Bleeding', icon: 'alert-triangle', severity: 'high' },
  { id: 11, name: 'Difficulty Breathing', icon: 'alert-octagon', severity: 'high' },
  { id: 12, name: 'Excessive Thirst', icon: 'droplet', severity: 'medium' },
];

const SymptomCheckerScreen = ({ navigation }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.find(s => s.id === symptom.id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleCheckSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('No Symptoms Selected', 'Please select at least one symptom.');
      return;
    }

    const hasHighSeverity = selectedSymptoms.some(s => s.severity === 'high');
    
    if (hasHighSeverity) {
      Alert.alert(
        '⚠️ Emergency Symptoms Detected',
        'Your pet may need immediate medical attention. Please contact a veterinarian right away.',
        [
          { text: 'Find Vet Clinic', onPress: () => navigation.navigate('VetClinicsMapScreen') },
          { text: 'View Results', onPress: () => setShowResults(true) }
        ]
      );
    } else {
      setShowResults(true);
    }
  };

  const getAdvice = () => {
    const hasHighSeverity = selectedSymptoms.some(s => s.severity === 'high');
    const hasMediumSeverity = selectedSymptoms.some(s => s.severity === 'medium');

    if (hasHighSeverity) {
      return {
        level: 'Emergency',
        color: '#b63e3e',
        advice: 'Seek immediate veterinary care. These symptoms may indicate a serious condition that requires urgent attention.',
        actions: ['Contact emergency vet', 'Monitor pet closely', 'Avoid giving food or water until assessed']
      };
    } else if (hasMediumSeverity) {
      return {
        level: 'Moderate Concern',
        color: '#ff9800',
        advice: 'Schedule a veterinary appointment within 24-48 hours. Monitor your pet\'s condition closely.',
        actions: ['Schedule vet appointment', 'Keep pet hydrated', 'Monitor symptoms', 'Note any changes']
      };
    } else {
      return {
        level: 'Low Concern',
        color: '#2e7d32',
        advice: 'These symptoms are generally mild, but monitor your pet. If symptoms persist or worsen, consult your vet.',
        actions: ['Monitor for 24-48 hours', 'Ensure proper hydration', 'Maintain normal routine', 'Contact vet if worsens']
      };
    }
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setAdditionalNotes('');
    setShowResults(false);
  };

  if (showResults) {
    const advice = getAdvice();

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetChecker}>
            <Feather name="arrow-left" size={24} color="#5a3d2b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Results</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={[styles.resultCard, { borderColor: advice.color }]}>
            <View style={styles.resultHeader}>
              <Feather name="alert-circle" size={32} color={advice.color} />
              <Text style={[styles.resultLevel, { color: advice.color }]}>{advice.level}</Text>
            </View>

            <Text style={styles.resultAdvice}>{advice.advice}</Text>

            <View style={styles.selectedSymptomsContainer}>
              <Text style={styles.sectionTitle}>Selected Symptoms:</Text>
              {selectedSymptoms.map(symptom => (
                <View key={symptom.id} style={styles.selectedSymptomItem}>
                  <Feather name="check-circle" size={16} color={advice.color} />
                  <Text style={styles.selectedSymptomText}>{symptom.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Recommended Actions:</Text>
              {advice.actions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <Text style={styles.actionBullet}>•</Text>
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
            </View>

            {additionalNotes.trim() && (
              <View style={styles.notesContainer}>
                <Text style={styles.sectionTitle}>Your Notes:</Text>
                <Text style={styles.notesText}>{additionalNotes}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: advice.color }]}
            onPress={() => navigation.navigate('VetClinicsMapScreen')}
          >
            <Feather name="map-pin" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Find Nearest Vet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetChecker}
          >
            <Text style={styles.resetButtonText}>Check New Symptoms</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#5a3d2b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Symptom Checker</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.infoCard}>
          <FontAwesome5 name="stethoscope" size={24} color="#8b5e3c" style={{ marginBottom: 12 }} />
          <Text style={styles.infoTitle}>How does this work?</Text>
          <Text style={styles.infoText}>
            Select the symptoms your pet is experiencing. Our AI-powered system will provide vet-reviewed advice and recommendations.
          </Text>
          <Text style={[styles.infoText, { marginTop: 8, fontStyle: 'italic', fontSize: 12 }]}>
            ⚠️ This tool is for guidance only and does not replace professional veterinary care.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Symptoms</Text>
        <View style={styles.symptomsGrid}>
          {COMMON_SYMPTOMS.map(symptom => {
            const isSelected = selectedSymptoms.find(s => s.id === symptom.id);
            return (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  isSelected && styles.symptomCardSelected,
                  symptom.severity === 'high' && isSelected && styles.symptomCardHigh
                ]}
                onPress={() => toggleSymptom(symptom)}
              >
                <Feather 
                  name={symptom.icon} 
                  size={24} 
                  color={isSelected ? '#fff' : '#8b5e3c'} 
                />
                <Text style={[
                  styles.symptomName,
                  isSelected && styles.symptomNameSelected
                ]}>
                  {symptom.name}
                </Text>
                {symptom.severity === 'high' && (
                  <View style={styles.severityBadge}>
                    <Text style={styles.severityText}>!</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Describe any additional symptoms or behaviors you've noticed..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={additionalNotes}
          onChangeText={setAdditionalNotes}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.checkButton,
            selectedSymptoms.length === 0 && styles.checkButtonDisabled
          ]}
          onPress={handleCheckSymptoms}
          disabled={selectedSymptoms.length === 0}
        >
          <Text style={styles.checkButtonText}>
            Check Symptoms ({selectedSymptoms.length})
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Disclaimer: This symptom checker provides general guidance only. Always consult with a licensed veterinarian for proper diagnosis and treatment.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a3d2b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#f8f5f2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0d5c6',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3d2b',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a3d2b',
    marginBottom: 12,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  symptomCard: {
    width: '47%',
    backgroundColor: '#f8f5f2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0d5c6',
    position: 'relative',
  },
  symptomCardSelected: {
    backgroundColor: '#8b5e3c',
    borderColor: '#8b5e3c',
  },
  symptomCardHigh: {
    backgroundColor: '#b63e3e',
    borderColor: '#b63e3e',
  },
  symptomName: {
    fontSize: 13,
    color: '#5a3d2b',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  symptomNameSelected: {
    color: '#fff',
  },
  severityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#b63e3e',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: '#f8f5f2',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0d5c6',
    marginBottom: 24,
    minHeight: 100,
  },
  checkButton: {
    backgroundColor: '#8b5e3c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    marginBottom: 20,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  resultAdvice: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedSymptomsContainer: {
    marginBottom: 20,
  },
  selectedSymptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedSymptomText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionBullet: {
    fontSize: 16,
    color: '#8b5e3c',
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: '#f8f5f2',
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    borderWidth: 2,
    borderColor: '#8b5e3c',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#8b5e3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SymptomCheckerScreen;