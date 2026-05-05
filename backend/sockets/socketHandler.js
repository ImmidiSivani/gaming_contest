const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const initializeSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: userId=${socket.userId}, socketId=${socket.id}`);

    socket.join(socket.userId);

    socket.on('joinLeaderboard', () => {
      socket.join('leaderboard');
      logger.info(`User ${socket.userId} joined leaderboard room`);
    });

    socket.on('leaveLeaderboard', () => {
      socket.leave('leaderboard');
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: userId=${socket.userId}, socketId=${socket.id}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.userId}: ${error.message}`);
    });
  });

  logger.info('Socket.IO initialized');
};

module.exports = { initializeSocket };
