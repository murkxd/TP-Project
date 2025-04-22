const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const WebSocket = require('ws');
const db = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', (req, res) => {
  res.send('API route group');
});

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