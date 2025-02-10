const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.db'));

// Adicione este código temporariamente no início do server.js para recriar a tabela
db.exec(`
  DROP TABLE IF EXISTS users;
  CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id VARCHAR,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL UNIQUE,
      password_hash VARCHAR,
      phone VARCHAR,
      favorite_food VARCHAR,
      favorite_type VARCHAR,
      profile_picture VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
  )
`);

module.exports = db;
