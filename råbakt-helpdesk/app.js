const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
    host: 'db',       // MySQL container name
    user: 'iseeanoob',
    password: 'pass',
    database: 'mydb'
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).send('Missing fields');

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).send({ id: result.insertId, username, email });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).send('Username or email already exists');
        } else {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
