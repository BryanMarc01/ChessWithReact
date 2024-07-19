const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chessdb',
  password: 'level',
  port: 5432,
});

module.exports = pool;
