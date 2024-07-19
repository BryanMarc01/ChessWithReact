// backend/routes/games.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear una nueva partida
router.post('/games', async (req, res) => {
  const { white_player, black_player } = req.body;
  try {
    const newGame = await pool.query(
      'INSERT INTO games (white_player, black_player, state) VALUES ($1, $2, $3) RETURNING *',
      [white_player, black_player, 'waiting']
    );
    res.json(newGame.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Obtener todas las partidas
router.get('/games', async (req, res) => {
  try {
    const games = await pool.query('SELECT * FROM games');
    res.json(games.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
