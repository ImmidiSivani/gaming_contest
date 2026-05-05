const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authorization token missing', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, 'Authentication failed', 401);
  }
};
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required', 403);
  }
  next();
};

const requireActiveStatus = (req, res, next) => {
  if (req.user.status === 'eliminated') {
    return errorResponse(res, 'You have been eliminated and cannot proceed further', 403);
  }
  next();
};

const requirePhase = (phase) => (req, res, next) => {
  if (req.user.currentPhase < phase) {
    return errorResponse(res, `You must unlock phase ${phase} first`, 403);
  }
  if (req.user.currentPhase > phase) {
    return errorResponse(res, `You have already completed phase ${phase}`, 400);
  }
  next();
};

module.exports = { protect, requireActiveStatus, requirePhase, requireAdmin};
