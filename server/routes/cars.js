console.log('cars.js ROUTES loaded');

const express = require('express');
const multer = require('multer');
const db = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

const upload = multer({ dest: 'uploads/' });

// Get all listings (e.g. for homepage)
router.get('/all', async (req, res) => {
  try {
    const {
      fuel_type,
      drivetrain,
      min_price,
      max_price,
      search,
      sort_by,
      features
    } = req.query;

    const whereClauses = [];
    const params = [];

    if (fuel_type) {
      whereClauses.push('cars.fuel_type = ?');
      params.push(fuel_type);
    }

    if (drivetrain) {
      whereClauses.push('cars.drivetrain = ?');
      params.push(drivetrain);
    }

    if (min_price) {
      whereClauses.push('cars.price >= ?');
      params.push(Number(min_price));
    }

    if (max_price) {
      whereClauses.push('cars.price <= ?');
      params.push(Number(max_price));
    }

    if (search) {
      whereClauses.push('(cars.brand LIKE ? OR cars.model LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Výchozí ORDER BY
    let orderBy = 'cars.created_at DESC';
    if (sort_by === 'price_asc') orderBy = 'cars.price ASC';
    if (sort_by === 'price_desc') orderBy = 'cars.price DESC';
    if (sort_by === 'date_oldest') orderBy = 'cars.created_at ASC';

    let featureJoin = '';
    let featureHaving = '';

    // Pokud jsou specifikovány výbavy, připravíme join
    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        console.warn('Invalid features filter');
      }

      if (parsedFeatures.length > 0) {
        featureJoin = `
          JOIN car_features cf ON cf.car_id = cars.id
          JOIN features f ON f.id = cf.feature_id
        `;
        whereClauses.push(`f.name IN (${parsedFeatures.map(() => '?').join(',')})`);
        params.push(...parsedFeatures);
        featureHaving = `GROUP BY cars.id HAVING COUNT(DISTINCT f.name) = ?`;
        params.push(parsedFeatures.length);
      }
    }

    const whereClause = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const query = `
      SELECT cars.id, brand, model, price, images
      FROM cars
      ${featureJoin}
      ${whereClause}
      ${featureHaving}
      ORDER BY ${orderBy}
    `;

    const [results] = await db.promise().query(query, params);

    const listings = results.map((car) => {
      let image = null;
      try {
        const images = JSON.parse(car.images || '[]');
        image = images[0] || null;
      } catch (e) {
        console.warn('Invalid image JSON for car ID', car.id);
      }

      return {
        id: car.id,
        title: `${car.brand} ${car.model}`,
        price: car.price,
        image,
      };
    });

    res.json(listings);
  } catch (err) {
    console.error('Error in /cars/all:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create car listing
router.post('/create', upload.array('images', 20), (req, res) => {
  console.log('CREATE LISTING HIT!');
  try {
    // Extract and verify JWT
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing token' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      brand,
      model,
      first_registration_year,
      first_registration_month,
      mileage,
      doors,
      fuel_type,
      power_kw,
      exterior_color,
      interior_material,
      interior_color,
      headlight_type,
      drivetrain,
      price,
      features,
      contact_phone,
    } = req.body;

    const imagePaths = req.files.map((file) => file.path);

    const carInsertQuery = `
    INSERT INTO cars (
      user_id, brand, model, first_registration_year, first_registration_month,
      mileage, doors, fuel_type, power_kw, exterior_color,
      interior_material, interior_color, headlight_type, drivetrain, price, contact_phone, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
  
    const carInsertValues = [
      userId, brand, model, first_registration_year, first_registration_month,
      mileage, doors, fuel_type, power_kw, exterior_color,
      interior_material, interior_color, headlight_type, drivetrain, price, contact_phone];

    db.query(carInsertQuery, carInsertValues, (err, result) => {
      if (err) {
        console.error('Error inserting car:', err);
        return res.status(500).json({ error: 'Error creating car listing' });
      }

      const carId = result.insertId;

      // Vložení features do spojovací tabulky car_features
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        console.warn('Invalid features JSON');
      }

      if (parsedFeatures.length > 0) {
        const featureQuery = 'SELECT id FROM features WHERE name IN (?)';
        db.query(featureQuery, [parsedFeatures], (err, featureResults) => {
          if (err) {
            console.error('Error fetching feature IDs:', err);
            return res.status(500).json({ error: 'Feature processing failed' });
          }

          const carFeatureValues = featureResults.map((f) => [carId, f.id]);
          if (carFeatureValues.length > 0) {
            const carFeatureInsertQuery = 'INSERT INTO car_features (car_id, feature_id) VALUES ?';
            db.query(carFeatureInsertQuery, [carFeatureValues], (err) => {
              if (err) {
                console.error('Error inserting car_features:', err);
              }
            });
          }
        });
      }

      const updateImageQuery = 'UPDATE cars SET images = ? WHERE id = ?';
      db.query(updateImageQuery, [JSON.stringify(imagePaths), carId], (err) => {
        if (err) {
          console.error('Error updating images:', err);
        }
      });
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/test', (req, res) => {
  res.send('Cars route works!');
});

router.put('/edit/:id', upload.array('images', 20), async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }

  const carId = req.params.id;

  const {
    brand, model, first_registration_year, first_registration_month,
    mileage, doors, fuel_type, power_kw, exterior_color,
    interior_material, interior_color, headlight_type, drivetrain,
    price, features, contact_phone
  } = req.body;

  let imagePaths = req.files.length > 0 ? req.files.map(file => file.path) : null;
  let parsedFeatures = [];

  try {
    parsedFeatures = JSON.parse(features);
  } catch {
    console.warn('Invalid features JSON');
  }

  const updateQuery = `
    UPDATE cars SET
      brand = ?, model = ?, first_registration_year = ?, first_registration_month = ?,
      mileage = ?, doors = ?, fuel_type = ?, power_kw = ?, exterior_color = ?,
      interior_material = ?, interior_color = ?, headlight_type = ?, drivetrain = ?,
      price = ?, contact_phone = ? ${imagePaths ? ', images = ?' : ''}
    WHERE id = ? AND user_id = ?
  `;

  const values = [
    brand, model, first_registration_year, first_registration_month,
    mileage, doors, fuel_type, power_kw, exterior_color,
    interior_material, interior_color, headlight_type, drivetrain,
    price, contact_phone
  ];

  if (imagePaths) values.push(JSON.stringify(imagePaths));
  values.push(carId, userId);

  db.query(updateQuery, values, (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });

    // Update features (delete old, insert new)
    db.query('DELETE FROM car_features WHERE car_id = ?', [carId], () => {
      if (parsedFeatures.length > 0) {
        const featureQuery = 'SELECT id FROM features WHERE name IN (?)';
        db.query(featureQuery, [parsedFeatures], (err, featureResults) => {
          if (err) return;
          const carFeatureValues = featureResults.map(f => [carId, f.id]);
          db.query('INSERT INTO car_features (car_id, feature_id) VALUES ?', [carFeatureValues]);
        });
      }
    });
  });
});

// GET /api/cars/my-listings
router.get('/my-listings', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  const query = `SELECT id, brand, model, price, images FROM cars WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user listings:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    const listings = results.map((car) => ({
      id: car.id,
      title: `${car.brand} ${car.model}`,
      price: car.price,
      image: JSON.parse(car.images || '[]')[0] || null,
    }));

    res.json(listings);
  });
});

// DELETE /api/cars/:id
router.delete('/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  const carId = req.params.id;

  db.query('SELECT * FROM cars WHERE id = ? AND user_id = ?', [carId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length === 0) return res.status(404).json({ error: 'Car not found or unauthorized' });

    db.query('DELETE FROM cars WHERE id = ?', [carId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete listing' });
      res.json({ message: 'Listing deleted' });
    });
  });
});

// Detail jednoho vozu podle ID
router.get('/details/:id', async (req, res) => {
  try {
    const carId = req.params.id;

    // 1. Získáme detail auta včetně uživatele (JOIN s users)
    const [carResult] = await db.promise().query(`
      SELECT cars.*, users.username 
      FROM cars 
      JOIN users ON cars.user_id = users.id 
      WHERE cars.id = ?
    `, [carId]);

    if (carResult.length === 0) {
      return res.status(404).json({ error: 'Inzerát nenalezen' });
    }

    const car = carResult[0];

    // 2. Zparsuj obrázky
    try {
      car.images = JSON.parse(car.images || '[]');
    } catch {
      car.images = [];
    }

    // 3. Získání výbavy
    const [featureResult] = await db.promise().query(`
      SELECT f.name FROM features f
      JOIN car_features cf ON f.id = cf.feature_id
      WHERE cf.car_id = ?
    `, [carId]);

    car.features = featureResult.map(f => f.name);

    res.json(car);
  } catch (err) {
    console.error('Chyba při získání detailu vozu:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;