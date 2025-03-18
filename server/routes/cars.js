const express = require('express');
const multer = require('multer');
const db = require('../db');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Create a car listing
router.post('/', upload.array('images', 20), (req, res) => {
  const { brand, model, year, price, mileage, fuelType, features } = req.body;
  const images = req.files.map(file => file.path);

  const query = 'INSERT INTO cars (brand, model, year, price, mileage, fuelType, features, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [brand, model, year, price, mileage, fuelType, features, JSON.stringify(images)], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating car listing' });
    }
    res.status(201).json({ message: 'Car listing created successfully' });
  });
});

// Get all car listings
router.get('/', (req, res) => {
  const query = 'SELECT * FROM cars';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching car listings' });
    }
    res.json(results);
  });
});

// Get a single car by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM cars WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching car listing' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Car listing not found' });
    }
    res.json(results[0]);
  });
});

// Delete a listing
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cars WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting car listing' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Car listing not found' });
    }
    res.json({ message: 'Car listing deleted successfully' });
  });
});

// Filter listings
router.get('/filter', (req, res) => {
  const { brand, fuelType, minPrice, maxPrice, minMileage, maxMileage, features } = req.query;
  let query = 'SELECT * FROM cars WHERE 1=1';
  const params = [];

  if (brand) {
    query += ' AND brand = ?';
    params.push(brand);
  }
  if (fuelType) {
    query += ' AND fuelType = ?';
    params.push(fuelType);
  }
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }
  if (minMileage) {
    query += ' AND mileage >= ?';
    params.push(minMileage);
  }
  if (maxMileage) {
    query += ' AND mileage <= ?';
    params.push(maxMileage);
  }
  if (features) {
    query += ' AND features LIKE ?';
    params.push(`%${features}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error filtering car listings' });
    }
    res.json(results);
  });
});

module.exports = router;
