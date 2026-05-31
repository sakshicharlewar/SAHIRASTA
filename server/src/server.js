import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import propertyRoutes from './routes/propertyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import savedPropertyRoutes from './routes/savedPropertyRoutes.js';

dotenv.config();
initDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Global logger to debug 404s
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/saved', savedPropertyRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mock Commute API
app.get('/api/commute', (req, res) => {
  const { fromLat, fromLng, toLat, toLng, mode } = req.query;
  
  if (!fromLat || !fromLng || !toLat || !toLng) {
    return res.status(400).json({ error: 'Missing coordinates' });
  }

  // Mock response
  res.json({
    travelTime: Math.floor(Math.random() * 45) + 5,
    distance: (Math.random() * 15 + 2).toFixed(2),
    trafficEstimate: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
  });
});

// Serve static files from the React app in production
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));

// Catch all handler: send back React's index.html file for any non-API routes
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.resolve(distPath, 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`SahiRasta running on http://localhost:${PORT}`);
});
