import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import reservationRoutes from './routes/reservations.js';
import restaurantsRoutes from './routes/restaurants.js';
import floorsRoutes from './routes/floors.js';
import tablesRoutes from './routes/tables.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/floors', floorsRoutes);
app.use('/api/tables', tablesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
