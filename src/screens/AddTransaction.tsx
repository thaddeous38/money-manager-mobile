import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { insertTransaction } from '../db';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTransaction'>;

export default function AddTransaction({ navigation }: Props) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  async function onSave() {
    const amt = Math.round(parseFloat(amount || '0') * 100);
    if (!amt) {
      Alert.alert('Validation', 'Please enter an amount');
      return;
    }
    try {
      await insertTransaction({ amount: amt, notes });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save transaction');
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount (USD)</Text>
      <TextInput keyboardType="numeric" style={styles.input} value={amount} onChangeText={setAmount} />

      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} />

      <Button title="Save" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 6, padding: 8 }
});
