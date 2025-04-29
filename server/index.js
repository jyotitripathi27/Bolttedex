// Sets up the Express server with security, CORS, routing, and error handling.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pokemonRoutes from './src/routes/pokemonRoutes.js';
import { logError } from './src/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Basic security headers
app.use(helmet());

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));

// Only allow our frontend to access this API
app.use(cors({ origin: FRONTEND_URL }));

// All application routes
app.use('/api', pokemonRoutes);

// If no route matched, send 404
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  logError('API error:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
