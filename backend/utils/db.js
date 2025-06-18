import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test & log any connection errors
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ MySQL pool connection error:', err.code, err.message);
  } else {
    console.log('✅ MySQL pool connected successfully');
    conn.release();
  }
});

export default pool.promise(); // use promise-based pool
