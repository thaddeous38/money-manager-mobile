import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { getTransactions, Transaction } from '../db';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function Dashboard({ navigation }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const load = async () => {
    const rows = await getTransactions();
    setTransactions(rows);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      load();
    });

    load();
    return unsub;
  }, [navigation]);

  const summary = useMemo(() => {
    const income = transactions.reduce((sum, tx) => {
      return tx.type === 'income' ? sum + tx.amount : sum;
    }, 0);

    const expense = transactions.reduce((sum, tx) => {
      return tx.type === 'expense' ? sum + tx.amount : sum;
    }, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.card, styles.incomeCard]}>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={styles.cardValue}>${(summary.income / 100).toFixed(2)}</Text>
        </View>
        <View style={[styles.card, styles.expenseCard]}>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={styles.cardValue}>${(summary.expense / 100).toFixed(2)}</Text>
        </View>
      </View>

      <View style={[styles.card, styles.balanceCard]}>
        <Text style={styles.cardLabel}>Balance</Text>
        <Text style={styles.balanceValue}>${(summary.balance / 100).toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={styles.addBtnText}>+ Add Transaction</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            <View>
              <Text style={styles.txTitle}>{item.notes || 'No notes'}</Text>
              <Text style={styles.txMeta}>
                {item.category} • {new Date(item.date * 1000).toLocaleDateString()}
              </Text>
            </View>
            <Text
              style={[
                styles.txAmount,
                { color: item.type === 'income' ? '#16A34A' : '#DC2626' },
              ]}
            >
              {item.type === 'income' ? '+' : '-'}${(item.amount / 100).toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  card: { flex: 1, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  incomeCard: { backgroundColor: '#DCFCE7' },
  expenseCard: { backgroundColor: '#FEE2E2' },
  balanceCard: { backgroundColor: '#DBEAFE', marginBottom: 12 },
  cardLabel: { fontSize: 12, color: '#374151', textTransform: 'uppercase', marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#111827' },
  balanceValue: { fontSize: 26, fontWeight: '800', color: '#111827' },
  addBtn: { backgroundColor: '#2563EB', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 18 },
  addBtnText: { color: '#FFF', fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  listContent: { paddingBottom: 24 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, marginBottom: 8 },
  txTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  txMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  txAmount: { fontSize: 16, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 10 },
});
