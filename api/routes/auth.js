// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registro de usuarios
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [
      username,
      password,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid credentials');
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
