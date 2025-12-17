// server/config/database.js
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

export const dbConfig = {
    connectionString: process.env.DB_URL,
    ssl: false // Set to true if your database requires SSL connections
};