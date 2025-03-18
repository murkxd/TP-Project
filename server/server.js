const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db'); // Import the db module
const authRoutes = require('./routes/auth'); // Import the auth routes
const carRoutes = require('./routes/cars'); // Import the car routes

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // Use the auth routes
app.use('/api/cars', carRoutes); // Use the car routes

app.use('/api', (req, res) => {
  res.send('API route group');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
