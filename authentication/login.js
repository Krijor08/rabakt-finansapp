const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const DB_CONFIG = {
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "pass",
  database: process.env.DB_NAME || "mydb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

// 🧠 MySQL with retry logic
async function connectWithRetry(retries = 10, delay = 5000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const pool = mysql.createPool(DB_CONFIG);
      const conn = await pool.getConnection();
      console.log("✅ Connected to MySQL!");

      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role INT DEFAULT 1
        )
      `);

      conn.release();
      console.log("✅ Users table ready");
      return pool;
    } catch (err) {
      console.error(`❌ MySQL not ready (attempt ${i}/${retries}): ${err.code}`);
      if (i === retries) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 🔑 Register
app.post("/auth/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields required." });

  try {
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0)
      return res.status(400).json({ error: "Email or username already in use." });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashed, role || 1]
    );

    res.json({ message: "User created", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 🔐 Login
app.post("/auth/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password)
    return res.status(400).json({ error: "Missing credentials." });

  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
      [identifier, identifier]
    );

    if (users.length === 0)
      return res.status(401).json({ error: "Invalid credentials." });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 🧙‍♂️ Create first superadmin
app.post("/auth/create-superadmin", async (req, res) => {
  const { secret, username, email, password } = req.body;
  if (secret !== "bootstrapSecret123")
    return res.status(403).json({ error: "Forbidden" });

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE role = 5");
    if (existing.length > 0)
      return res.status(400).json({ error: "Superadmin exists." });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 5)",
      [username, email, hashed]
    );

    res.json({ message: "Superadmin created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating superadmin." });
  }
});

(async () => {
  pool = await connectWithRetry();
  app.listen(PORT, () => console.log(`🚀 Auth service running on ${PORT}`));
})();
