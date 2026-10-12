import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import { testConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Configure CORS for production and development
// Allow the specific Vercel production domain configured via FRONTEND_URL,
// while retaining support for local development origins.
const parseAllowedOrigins = () => {
  const origins = [];

  if (process.env.FRONTEND_URL) {
    // Support comma-separated URLs if multiple production/preview domains are used
    const urls = process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''));
    origins.push(...urls);
  }

  // Retain local development origins
  origins.push('http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173');

  return [...new Set(origins.filter(Boolean))];
};

const allowedOrigins = parseAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, uptime monitors, server-to-server health checks)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`[CORS Blocked] Request origin "${origin}" not in allowed list:`, allowedOrigins);
    return callback(new Error(`CORS blocked: Origin ${origin} is not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware for monitoring
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root & Health check endpoints (essential for Render / Uptime monitors)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'TaskFlow API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount task routes
app.use('/api/tasks', taskRoutes);

// Catch-all 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ message: err.message });
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server - listen on process.env.PORT and bind to 0.0.0.0 for containerized/cloud hosting (Render)
app.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT} (bound to port ${PORT})`);
  console.log(`🔒 Allowed CORS origins:`, allowedOrigins);
  // Test database connection when server starts up
  await testConnection();
});
