const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./contacts.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL
    )
  `);
});

module.exports = db;
