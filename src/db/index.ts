import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('money.db');

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
  // Create tables
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY NOT NULL,
        amount INTEGER NOT NULL,
        notes TEXT,
        date INTEGER DEFAULT (strftime('%s','now'))
      );`
    );
  }, (e) => {
    console.error('init db error', e);
  });
}

export async function insertTransaction({ amount, notes }: { amount: number; notes?: string }) {
  await executeSql('INSERT INTO transactions (amount, notes, date) VALUES (?, ?, strftime("%s","now"))', [amount, notes]);
}

export async function getTransactions() {
  const [rows] = await executeSql('SELECT id, amount, notes, date FROM transactions ORDER BY date DESC');
  const out: any[] = [];
  for (let i = 0; i < rows.length; i++) {
    out.push(rows.item(i));
  }
  return out;
}
