const leaderboardService = require('../services/leaderboardService');
const { successResponse } = require('../utils/responseFormatter');

const getLeaderboard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const result = await leaderboardService.getLeaderboard({ page, limit });
    return successResponse(res, 'Leaderboard retrieved', result);
  } catch (error) {
    next(error);
  }
};

const getTopUsers = async (req, res, next) => {
  try {
    const n = Math.min(parseInt(req.query.n) || 10, 50);
    const topUsers = await leaderboardService.getTopN(n);
    return successResponse(res, `Top ${n} users retrieved`, { leaderboard: topUsers });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard, getTopUsers };
