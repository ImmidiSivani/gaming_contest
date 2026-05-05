require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Config & utils
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { initializeSocket } = require('./sockets/socketHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const phaseRoutes = require('./routes/phaseRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

// 🔹 Connect Database
connectDB();

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Health Check (optional but useful)
app.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀' });
});

// 🔹 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/phase', phaseRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 🔹 Error Handler (MUST be last)
app.use(errorHandler);

// 🔹 Create HTTP Server
const server = http.createServer(app);

// 🔹 Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // change in production
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

// Initialize socket logic
initializeSocket(io);

// 🔹 Start Server
const PORT = process.env.PORT || 5001;

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    logger.error(`Server error: ${error.message}`);
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use. Stop the other process or set a different PORT.`);
      process.exit(1);
      break;
    default:
      logger.error(`Server error: ${error.message}`);
      throw error;
  }
});

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

module.exports = app;