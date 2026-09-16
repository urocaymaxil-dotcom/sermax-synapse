import express from 'express';
import cors from 'cors';
import db, { initDb } from './db';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
app.get('/api/requests', (req, res) => {
  db.all('SELECT * FROM requests ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/requests', (req, res) => {
  const { studentName, section, subject, preferredDate, preferredTime, purpose } = req.body;
  const id = `r${Date.now()}`;
  const status = 'Pending';
  const priorityScore = Math.floor(50 + Math.random() * 40);
  const waitDays = 0;
  const displacementCount = 0;
  const createdAt = new Date().toISOString();

  const query = `
    INSERT INTO requests (id, studentName, section, subject, preferredDate, preferredTime, purpose, status, priorityScore, waitDays, displacementCount, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [id, studentName, section, subject, preferredDate, preferredTime, purpose, status, priorityScore, waitDays, displacementCount, createdAt], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, status, priorityScore, createdAt });
  });
});

app.put('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  
  if (!fields) return res.status(400).json({ error: 'No fields to update' });
  
  db.run(`UPDATE requests SET ${fields} WHERE id = ?`, [...values, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, updated: this.changes });
  });
});

// --- Availability Endpoints ---
app.get('/api/availability', (req, res) => {
  db.all('SELECT * FROM availability', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/availability', (req, res) => {
  const { facultyId, dayOfWeek, date, startTime, endTime, type } = req.body;
  const id = `avail${Date.now()}`;
  
  const query = `INSERT INTO availability (id, facultyId, dayOfWeek, date, startTime, endTime, type) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [id, facultyId, dayOfWeek, date, startTime, endTime, type], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});

app.delete('/api/availability/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM availability WHERE id = ?`, id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
