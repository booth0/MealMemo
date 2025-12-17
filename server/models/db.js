// server/models/db.js
import { Pool } from 'pg';
import { dbConfig } from '../config/database.js';

const pool = new Pool(dbConfig);

let db = null;

if (process.env.NODE_ENV?.includes('dev') && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', { 
                    text: text.replace(/\s+/g, ' ').trim(), 
                    duration: `${duration}ms`, 
                    rows: res.rowCount 
                });
                return res;
            } catch (error) {
                console.error('Error in query:', { 
                    text: text.replace(/\s+/g, ' ').trim(), 
                    error: error.message 
                });
                throw error;
            }
        },

        connect: (...args) => pool.connect(...args),

        close: async () => {
            await pool.end();
        }
    };
} else {
    db = pool;
}

export default db;