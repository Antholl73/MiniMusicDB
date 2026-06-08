// Archivo: src/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
        rejectUnauthorized: false // Necesario para conexiones seguras en la nube
    }
});

module.exports = pool;