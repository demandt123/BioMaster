const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Maak of open de gratis SQLite database
const dbPath = path.join(__dirname, 'biomaster.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database fout:', err.message);
    } else {
        console.log('Verbonden met de BioMaster SQLite database.');
    }
});

// Tabellen aanmaken voor gebruikers en hun voortgang
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        topic TEXT,
        percentage INTEGER,
        UNIQUE(username, topic)
    )`);
});

// Test route om te kijken of de server online is
app.get('/api/status', (req, res) => {
    res.json({ status: "online", message: "BioMaster database is actief!" });
});

// Start de server op poort 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`BioMaster server draait succesvol op poort ${PORT}`);
});
