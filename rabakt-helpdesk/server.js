const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const DB_CONFIG = {
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "iseeanoob",
  password: process.env.DB_PASSWORD || "pass",
  database: process.env.DB_NAME || "mydb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

// 🧠 Connect to MySQL with retry logic
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

      await conn.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      conn.release();
      console.log("✅ Tables ready");
      return pool;
    } catch (err) {
      console.error(`❌ MySQL not ready (attempt ${i}/${retries}): ${err.code}`);
      if (i === retries) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 🔒 JWT Authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
}

// 👑 Role-based middleware
function requireRank(minRank) {
  return (req, res, next) => {
    authenticateToken(req, res, () => {
      if (req.user.role < minRank)
        return res.status(403).json({ error: "Insufficient privileges." });
      next();
    });
  };
}

const ROLES = {
  1: "user",
  2: "moderator",
  3: "manager",
  4: "admin",
  5: "superadmin",
};

(async () => {
  pool = await connectWithRetry();

  app.get("/", (req, res) => res.send("🚀 Node + MySQL App Running"));

  // 🧾 Register
  app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields required." });

    try {
      const [existing] = await pool.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [email, username]
      );
      if (existing.length > 0)
        return res
          .status(400)
          .json({ error: "Email or username already in use." });

      const hashed = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, hashed, role || 1]
      );

      const token = jwt.sign(
        { id: result.insertId, username, email, role: role || 1 },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Registration successful",
        token,
        user: { id: result.insertId, username, email, role: role || 1 },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  // 🔑 Login
  app.post("/login", async (req, res) => {
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
      if (!valid) return res.status(401).json({ error: "Invalid credentials." });

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  // ✅ Get todos
  app.get("/todos", authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Error fetching todos." });
    }
  });

  // ➕ Add todo
  app.post("/todos", authenticateToken, async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required." });
    try {
      const [result] = await pool.query(
        "INSERT INTO todos (user_id, title) VALUES (?, ?)",
        [req.user.id, title]
      );
      res.json({ id: result.insertId, title, completed: false });
    } catch {
      res.status(500).json({ error: "Error adding todo." });
    }
  });

  // 🧑‍💼 Admin panel: users + todos
  app.get("/admin/users-todos", requireRank(4), async (req, res) => {
    try {
      const [users] = await pool.query("SELECT id, username, email, role FROM users");
      const data = await Promise.all(
        users.map(async (u) => {
          const [todos] = await pool.query("SELECT * FROM todos WHERE user_id = ?", [u.id]);
          return {
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role,
            roleName: ROLES[u.role],
            totalTodos: todos.length,
            completed: todos.filter((t) => t.completed).length,
            todos,
          };
        })
      );
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching admin data." });
    }
  });

  // 🔺 Promote/Demote (Option 1 logic)
  app.put("/admin/role/:id", requireRank(4), async (req, res) => {
    const { id } = req.params;
    const { newRole } = req.body;

    if (!newRole || newRole < 1 || newRole > 5)
      return res.status(400).json({ error: "Invalid role value (1-5)." });

    try {
      const [rows] = await pool.query("SELECT role FROM users WHERE id = ?", [id]);
      if (rows.length === 0) return res.status(404).json({ error: "User not found." });

      const targetRole = rows[0].role;

      // Option 1: allow promotion/demotion up to one rank below your own role
      if (newRole >= req.user.role && req.user.role < 5)
        return res.status(403).json({ error: "Cannot promote to equal or higher than your own rank." });

      await pool.query("UPDATE users SET role = ? WHERE id = ?", [newRole, id]);
      res.json({ message: `User role updated to ${ROLES[newRole]}.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating user role." });
    }
  });

  // ❌ Delete user
  app.delete("/admin/users/:id", requireRank(4), async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query("SELECT role FROM users WHERE id = ?", [id]);
      if (rows.length === 0) return res.status(404).json({ error: "User not found." });

      if (rows[0].role >= req.user.role && req.user.role < 5)
        return res.status(403).json({ error: "Cannot delete equal or higher rank." });

      await pool.query("DELETE FROM users WHERE id = ?", [id]);
      res.json({ message: "User deleted successfully." });
    } catch {
      res.status(500).json({ error: "Error deleting user." });
    }
  });

  // 🧙‍♂️ Create first superadmin (one-time use)
  app.post("/create-superadmin", async (req, res) => {
    const { secret, username, email, password } = req.body;
    if (secret !== "bootstrapSecret123")
      return res.status(403).json({ error: "Forbidden" });

    try {
      const [existing] = await pool.query("SELECT * FROM users WHERE role = 5");
      if (existing.length > 0)
        return res.status(400).json({ error: "Superadmin already exists." });

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

  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})();