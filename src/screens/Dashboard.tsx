import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { getTransactions } from '../db';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function Dashboard({ navigation }: Props) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      load();
    });
    load();
    return unsub;
  }, [navigation]);

  async function load() {
    const rows = await getTransactions();
    setTransactions(rows);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={styles.addBtnText}>+ Add Transaction</Text>
      </TouchableOpacity>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            <Text style={styles.txDesc}>{item.notes || 'No notes'}</Text>
            <Text style={styles.txAmount}>${(item.amount / 100).toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No transactions yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
  addBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, marginBottom: 12, alignSelf: 'flex-start' },
  addBtnText: { color: 'white', fontWeight: '600' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#EEE' },
  txDesc: { fontSize: 16 },
  txAmount: { fontSize: 16, fontWeight: '600' }
});
