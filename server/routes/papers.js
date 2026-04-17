import express from 'express';
import pool from '../db.js';

const router = express.Router();

const ALLOWED_STATUS = ['to_read', 'reading', 'read'];

function normalizePaper(body) {
  return {
    title: body.title?.trim() || '',
    authors: body.authors?.trim() || null,
    year:
      body.year === '' || body.year === undefined || body.year === null
        ? null
        : Number(body.year),
    url: body.url?.trim() || null,
    status: body.status?.trim() || 'to_read',
    tags: body.tags?.trim() || null,
    summary: body.summary?.trim() || null,
    notes: body.notes?.trim() || null,
    date_read:
      body.date_read === '' || body.date_read === undefined || body.date_read === null
        ? null
        : body.date_read
  };
}

function validatePaper(paper) {
  const errors = {};

  if (!paper.title) {
    errors.title = 'Title is required.';
  }

  if (paper.year !== null && (!Number.isInteger(paper.year) || paper.year < 0 || paper.year > 3000)) {
    errors.year = 'Year must be a whole number between 0 and 3000.';
  }

  if (!ALLOWED_STATUS.includes(paper.status)) {
    errors.status = `Status must be one of: ${ALLOWED_STATUS.join(', ')}`;
  }

  return errors;
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM papers
      ORDER BY date_added DESC, id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid paper id.' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM papers WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Paper not found.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching paper:', error);
    res.status(500).json({ error: 'Failed to fetch paper.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const paper = normalizePaper(req.body);
    const errors = validatePaper(paper);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation failed.', errors });
    }

    const [result] = await pool.query(
      `
      INSERT INTO papers
        (title, authors, year, url, status, tags, summary, notes, date_read)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        paper.title,
        paper.authors,
        paper.year,
        paper.url,
        paper.status,
        paper.tags,
        paper.summary,
        paper.notes,
        paper.date_read
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM papers WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({ error: 'Failed to create paper.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid paper id.' });
    }

    const paper = normalizePaper(req.body);
    const errors = validatePaper(paper);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation failed.', errors });
    }

    const [existing] = await pool.query(
      'SELECT id FROM papers WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Paper not found.' });
    }

    await pool.query(
      `
      UPDATE papers
      SET
        title = ?,
        authors = ?,
        year = ?,
        url = ?,
        status = ?,
        tags = ?,
        summary = ?,
        notes = ?,
        date_read = ?
      WHERE id = ?
      `,
      [
        paper.title,
        paper.authors,
        paper.year,
        paper.url,
        paper.status,
        paper.tags,
        paper.summary,
        paper.notes,
        paper.date_read,
        id
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM papers WHERE id = ?',
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating paper:', error);
    res.status(500).json({ error: 'Failed to update paper.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid paper id.' });
    }

    const [result] = await pool.query(
      'DELETE FROM papers WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paper not found.' });
    }

    res.json({ message: 'Paper deleted successfully.' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ error: 'Failed to delete paper.' });
  }
});

export default router;