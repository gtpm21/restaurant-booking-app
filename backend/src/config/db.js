const mariadb = require('mariadb');
require('dotenv').config(); 


const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: 5, 
});


async function checkConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Successfully connected to the database.");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  } finally {
    if (conn) conn.release(); 
  }
}

checkConnection();

module.exports = pool;