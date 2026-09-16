import express from 'express';
import cors from 'cors';
import pool, { initDb } from './db';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
initDb();

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
  const { role } = req.body;
  if (role === 'faculty' || role === 'student') {
    res.json({ success: true, role, token: `fake-jwt-token-${role}` });
  } else {
    res.status(401).json({ error: 'Invalid role' });
  }
});

// --- Requests Endpoints ---
app.get('/api/requests', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM requests ORDER BY "createdAt" DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/requests', async (req, res) => {
  const { studentId, studentName, section, facultyId, facultyName, subject, concern, mode, description, preferredDate, preferredTime, duration, hasDeadline, deadline } = req.body;
  const id = `r${Date.now()}`;
  const status = 'Pending';
  const priorityScore = Math.floor(50 + Math.random() * 40);
  const createdAt = new Date().toISOString();

  const query = `
    INSERT INTO requests (id, "studentId", "studentName", section, "facultyId", "facultyName", subject, concern, mode, description, "preferredDate", "preferredTime", duration, "hasDeadline", deadline, status, "priorityScore", "createdAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    RETURNING *
  `;
  try {
    const { rows } = await pool.query(query, [id, studentId, studentName, section, facultyId, facultyName, subject, concern, mode, description, preferredDate, preferredTime, duration, hasDeadline, deadline, status, priorityScore, createdAt]);
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const fields = Object.keys(updates).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
  const values = Object.values(updates);
  
  if (!fields) return res.status(400).json({ error: 'No fields to update' });
  
  try {
    const { rowCount } = await pool.query(`UPDATE requests SET ${fields} WHERE id = $${values.length + 1}`, [...values, id]);
    res.json({ success: true, updated: rowCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Schedule Endpoints ---
app.get('/api/schedule', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM schedule');
    // days is stored as JSON string, parse it back
    const formatted = rows.map(r => ({
      ...r,
      days: r.days ? JSON.parse(r.days) : []
    }));
    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/schedule', async (req, res) => {
  const { title, type, days, startTime, endTime, recurring, location, mode, studentName, section } = req.body;
  const id = `ev${Date.now()}`;
  
  const query = `
    INSERT INTO schedule (id, title, type, days, "startTime", "endTime", recurring, location, mode, "studentName", section) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  try {
    const { rows } = await pool.query(query, [id, title, type, JSON.stringify(days || []), startTime, endTime, recurring, location, mode, studentName, section]);
    res.json({ ...rows[0], days: JSON.parse(rows[0].days) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/schedule/:id', async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if (updates.days) updates.days = JSON.stringify(updates.days);

  const fields = Object.keys(updates).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
  const values = Object.values(updates);
  
  if (!fields) return res.status(400).json({ error: 'No fields to update' });
  
  try {
    const { rowCount } = await pool.query(`UPDATE schedule SET ${fields} WHERE id = $${values.length + 1}`, [...values, id]);
    res.json({ success: true, updated: rowCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/schedule/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(`DELETE FROM schedule WHERE id = $1`, [id]);
    res.json({ success: true, deleted: rowCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
