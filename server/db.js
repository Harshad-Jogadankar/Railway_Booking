// db.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "rail",
  password:"Anonymous@5684",
  database: "train",
});

module.exports = pool.promise();
