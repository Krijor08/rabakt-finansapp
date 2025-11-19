const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // serve todos/admin HTML and CSS

const PORT = process.env.PORT || 3001; // different port from auth service
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

// 🧠 MySQL connection with retry logic
async function connectWithRetry(retries = 10, delay = 5000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const p = mysql.createPool(DB_CONFIG);
      const conn = await p.getConnection();
      console.log("✅ Connected to MySQL!");

      await conn.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      conn.release();
      console.log("✅ Todos table ready");
      return p;
    } catch (err) {
      console.error(`❌ MySQL not ready (attempt ${i}/${retries}): ${err.code}`);
      if (i === retries) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 🔒 JWT Authentication middleware
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

// 👑 Role-based middleware for admin endpoints
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

  app.get("/", (req, res) => res.send("🚀 Node Todos/Admin App Running"));

  // ✅ Get todos
  app.get("/todos", authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error adding todo." });
    }
  });

  // 🔄 Update todo (toggle complete)
  app.put("/todos/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { completed, title } = req.body;

    try {
      await pool.query(
        "UPDATE todos SET completed = ?, title = ? WHERE id = ? AND user_id = ?",
        [completed, title, id, req.user.id]
      );
      res.json({ message: "Todo updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating todo." });
    }
  });

  // ❌ Delete todo
  app.delete("/todos/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM todos WHERE id = ? AND user_id = ?", [
        id,
        req.user.id,
      ]);
      res.json({ message: "Todo deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting todo." });
    }
  });

  // 🧑‍💼 Admin panel: users + todos (read-only)
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

  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();
