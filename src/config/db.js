const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "282444",
  database: process.env.DB_NAME || "lol_pros",
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

module.exports = pool.promise();
