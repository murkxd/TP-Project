const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

// Register route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login route
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

// Profile route
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
