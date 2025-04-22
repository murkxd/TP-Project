const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const WebSocket = require('ws');
const db = require('./db'); // Import DB modulu

// Načti .env proměnné
dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

// Middlewary
app.use(cors({
  origin: 'http://localhost:3000', // Povol frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Preflight OPTIONS požadavky
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request for:', req.path);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).json({});
  }
  next();
});

// Routy


const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Test route
app.use('/api', (req, res) => {
  res.send('API route group');
});

// WebSocket server
const server = app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('WebSocket připojen');
  ws.on('message', (message) => {
    console.log('Přijato:', message);
    ws.send('Zpráva přijata');
  });
  ws.on('close', () => {
    console.log('WebSocket odpojen');
  });
});

server.on('upgrade', (request, socket, head) => {
  if (request.url === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('close', () => {
  console.log('WebSocket server ukončen');
});