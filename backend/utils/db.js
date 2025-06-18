import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  connectionLimit: 20, // Adjust based on your load and MySQL hosting plan
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 10000, // 10 seconds
});

// Log when connection pool is created
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL pool connection error:', err.message);
  } else {
    console.log('✅ MySQL pool connected successfully!');
    connection.release();
  }
});

export default pool;
