import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import papersRouter from './routes/papers.js';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from the Express backend!'
  });
});

app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS server_time');

    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      databaseTime: rows[0].server_time
    });
  } catch (error) {
    console.error('Status route DB error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Database connection failed.'
    });
  }
});

app.use('/api/papers', papersRouter);

app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});