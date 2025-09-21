const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POST /contacts
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;

  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^\d{10}$/;
  if (!name || !emailRegex.test(email) || !phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const query = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
  db.run(query, [name, email, phone], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, email, phone });
  });
});

// GET /contacts?page&limit
app.get('/contacts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  db.all(`SELECT COUNT(*) AS count FROM contacts`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = rows[0].count;

    db.all(`SELECT * FROM contacts LIMIT ? OFFSET ?`, [limit, offset], (err, contacts) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ contacts, total });
    });
  });
});

// DELETE /contacts/:id
app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM contacts WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
