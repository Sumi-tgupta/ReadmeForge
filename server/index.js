import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { initDb } from './db/connection.js';
import generateRouter from './routes/generate.js';
import projectsRouter from './routes/projects.js';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '50kb' })); // Request size limit

// Global rate limiter: 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// --- Routes ---
app.use('/api/auth', authRouter);
app.use('/api/generate', generateRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/user', userRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Error handling ---
app.use(errorHandler);

// --- Start ---
async function start() {
  try {
    initDb();
    console.log('✅ Database initialized');
    app.listen(PORT, () => {
      console.log(`🚀 README Forge API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
