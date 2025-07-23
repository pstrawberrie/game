import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, './game.sqlite3');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

export default db; 