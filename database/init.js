const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Database file path
const dbPath = path.join(__dirname, 'malleability.db');

// Create or open database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split schema into individual statements and execute
const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

db.serialize(() => {
    statements.forEach((statement, index) => {
        db.run(statement, (err) => {
            if (err) {
                console.error(`Error executing statement ${index + 1}:`, err.message);
                console.error('Statement:', statement.trim());
            } else {
                console.log(`Executed statement ${index + 1} successfully`);
            }
        });
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database initialization completed. Connection closed.');
    }
});

module.exports = db; 