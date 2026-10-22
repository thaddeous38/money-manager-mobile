import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { insertTransaction, TransactionType } from '../db';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTransaction'>;

const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Salary', 'Other'];

export default function AddTransaction({ navigation }: Props) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState<TransactionType>('expense');

  async function onSave() {
    const cleaned = parseFloat(amount || '0');
    const cents = Math.round(cleaned * 100);

    if (!cleaned || Number.isNaN(cleaned) || cents <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount greater than 0');
      return;
    }

    try {
      await insertTransaction({
        amount: cents,
        notes,
        category,
        type,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save transaction');
      console.error(e);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.label}>Type</Text>
      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[styles.segment, type === 'expense' && styles.segmentActive]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.segmentText, type === 'expense' && styles.segmentTextActive]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, type === 'income' && styles.segmentActive]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.segmentText, type === 'income' && styles.segmentTextActive]}>Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        keyboardType="decimal-pad"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryGrid}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.categoryChip, category === item && styles.categoryChipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryChipText, category === item && styles.categoryChipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Groceries, salary, rent..."
      />

      <View style={styles.saveButton}>
        <Button title="Save" onPress={onSave} color="#2563EB" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  contentContainer: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 8, color: '#111827' },
  segmentRow: { flexDirection: 'row', marginBottom: 18 },
  segment: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', backgroundColor: '#FFF' },
  segmentActive: { backgroundColor: '#DBEAFE', borderColor: '#2563EB' },
  segmentText: { fontWeight: '600', color: '#374151' },
  segmentTextActive: { color: '#1D4ED8' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 999, marginRight: 8, marginBottom: 8 },
  categoryChipActive: { backgroundColor: '#DBEAFE', borderColor: '#2563EB' },
  categoryChipText: { color: '#374151', fontWeight: '600' },
  categoryChipTextActive: { color: '#1D4ED8' },
  saveButton: { marginTop: 8 },
});
