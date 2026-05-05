const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const register = async (req, res, next) => {
  try {
    const { name, email, password, collegeName } = req.body;
    const result = await authService.register({ name, email, password, collegeName });
    return successResponse(res, 'Registration successful', result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return successResponse(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  return successResponse(res, 'Profile retrieved', {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    collegeName: req.user.collegeName,
    currentPhase: req.user.currentPhase,
    totalScore: req.user.totalScore,
    phase1Score: req.user.phase1Score,
    phase2Score: req.user.phase2Score,
    phase3Score: req.user.phase3Score,
    phase1Completed: req.user.phase1Completed,
    phase2Completed: req.user.phase2Completed,
    phase3Completed: req.user.phase3Completed,
    isQualified: req.user.isQualified,
    status: req.user.status,
    rank: req.user.rank,
  });
};

module.exports = { register, login, getProfile };
