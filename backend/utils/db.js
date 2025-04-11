import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'u190761825_app_db',
});

db.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    return;
  }
  console.log('MySQL connected successfully!');
});

export default db;
