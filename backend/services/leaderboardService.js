const User = require('../models/User');

const getLeaderboard = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .sort({ totalScore: -1, createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .select('name email collegeName totalScore phase1Score phase2Score phase3Score currentPhase status phase1Completed phase2Completed phase3Completed createdAt');

  const totalUsers = await User.countDocuments({});
  const totalPages = Math.ceil(totalUsers / limit);

let lastScore = null;
let lastRank = 0;

const rankedUsers = users.map((user, index) => {
  if (user.totalScore === lastScore) {
    // same rank
  } else {
    lastRank = skip + index + 1;
  }

  lastScore = user.totalScore;

  return {
    rank: lastRank,
    id: user._id,
    name: user.name,
    collegeName: user.collegeName,
    totalScore: user.totalScore,
    phase1Score: user.phase1Score,
    phase2Score: user.phase2Score,
    phase3Score: user.phase3Score,
    currentPhase: user.currentPhase,
    status: user.status,
  };
});

  return {
    leaderboard: rankedUsers,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      limit,
    },
  };
};

const getTopN = async (n = 10) => {
  const users = await User.find({})
    .sort({ totalScore: -1, createdAt: 1 })
    .limit(n)
    .select('name collegeName totalScore currentPhase status');

  return users.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    collegeName: user.collegeName,
    totalScore: user.totalScore,
    currentPhase: user.currentPhase,
    status: user.status,
  }));
};

module.exports = { getLeaderboard, getTopN };
