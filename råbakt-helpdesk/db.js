const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "db", // MySQL container name
  user: "iseeanoob",
  password: "pass",
  database: "mydb",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
