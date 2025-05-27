const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventario.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    codigo TEXT UNIQUE,
    precio REAL,
    cantidad INTEGER
  )`);

  // Usuario de ejemplo
  db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, ["admin", "admin"]);
});

module.exports = db;
