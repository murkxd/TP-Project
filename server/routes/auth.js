const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  const userId = decoded.id;

  db.query('SELECT id, username, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  });
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

router.get('/profile', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const query = 'SELECT id, username FROM users WHERE id = ?';
    db.query(query, [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching user data' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(results[0]);
    });
  });
});

module.exports = router;
