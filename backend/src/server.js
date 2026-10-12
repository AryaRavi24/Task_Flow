import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import { testConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Determine if an incoming origin is permitted
const isOriginAllowed = (origin) => {
  // Allow non-browser requests (e.g. mobile apps, curl, uptime monitors, server-to-server health checks)
  if (!origin) return true;

  const normalized = origin.trim().replace(/\/+$/, '');

  // 1. Check user-configured FRONTEND_URL environment variable
  if (process.env.FRONTEND_URL) {
    const configuredOrigins = process.env.FRONTEND_URL.split(',')
      .map((url) => url.trim().replace(/\/+$/, ''))
      .filter(Boolean);

    if (configuredOrigins.includes(normalized)) return true;
  }

  // 2. Allow your deployed Vercel production domain & local development origins
  const trustedOrigins = [
    'https://task-flow-lemon-one.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];

  if (trustedOrigins.includes(normalized)) return true;

  // 3. Allow Vercel preview deployments for this project
  if (/^https:\/\/task-flow(-[a-z0-9-]+)?\.vercel\.app$/i.test(normalized)) {
    return true;
  }

  return false;
};

// CORS configuration options
const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200, // Return 200 for legacy browsers on OPTIONS preflight
};

// 1. Enable CORS middleware before any routes and body parsing
app.use(cors(corsOptions));

// 2. Explicitly handle preflight OPTIONS requests across all routes
app.options('*', cors(corsOptions));

// 3. Parse JSON request bodies
app.use(express.json());

// 4. Request logging middleware for monitoring
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
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server - listen on process.env.PORT and bind to 0.0.0.0 for containerized/cloud hosting (Render)
app.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT} (bound to port ${PORT})`);
  console.log(`🔒 Allowed origins include FRONTEND_URL and https://task-flow-lemon-one.vercel.app`);
  // Test database connection when server starts up
  await testConnection();
});
