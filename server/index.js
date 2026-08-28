import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import bookmarkRoutes from './routes/bookmarks.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.message || 'Internal server error' });
});

connectDatabase()
  .then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });
