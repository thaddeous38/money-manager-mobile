import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('money.db');

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: number;
  amount: number;
  notes: string;
  category: string;
  type: TransactionType;
  date: number;
};

function executeSql(sql: string, args: any[] = []) {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        args,
        (_, result) => resolve([result.rows, result]),
        (_, err): boolean => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function initDB() {
  db.transaction((tx) => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'General',
        type TEXT NOT NULL DEFAULT 'expense',
        date INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);
  }, (error) => {
    console.error('init db error', error);
  });
}

export async function insertTransaction({
  amount,
  notes,
  category,
  type,
}: {
  amount: number;
  notes?: string;
  category?: string;
  type?: TransactionType;
}) {
  await executeSql(
    'INSERT INTO transactions (amount, notes, category, type, date) VALUES (?, ?, ?, ?, strftime("%s","now"))',
    [amount, notes || '', category || 'General', type || 'expense']
  );
}

export async function getTransactions() {
  const [rows] = await executeSql(
    'SELECT id, amount, notes, category, type, date FROM transactions ORDER BY date DESC'
  );

  const out: Transaction[] = [];
  for (let i = 0; i < rows.length; i++) {
    out.push(rows.item(i));
  }

  return out;
}
