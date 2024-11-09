// db.js
const mysql = require('mysql2/promise'); // Use mysql2/promise for promises

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "rail",
  password: "Anonymous@5684", 
  database: "train",
});

module.exports = pool; // Return the pool itself
