const User = require('../models/User');
const { generatePhasePassword } = require('../utils/passwordGenerator');
const logger = require('../utils/logger');

const PHASE_CONFIG = {
  1: {
    scoreThreshold: () => parseFloat(process.env.PHASE1_SCORE_THRESHOLD) || 40,
    topPercentage: () => parseFloat(process.env.PHASE1_TOP_PERCENTAGE) || 50,
    nextPhase: 2,
    passwordField: 'phase2',
  },
  2: {
    scoreThreshold: () => parseFloat(process.env.PHASE2_SCORE_THRESHOLD) || 80,
    topPercentage: () => parseFloat(process.env.PHASE2_TOP_PERCENTAGE) || 50,
    nextPhase: 3,
    passwordField: 'phase3',
  },
};

const calculateRanks = async () => {
  const users = await User.find({})
    .sort({ totalScore: -1 })
    .select('_id totalScore');

  const total = users.length;

  let lastScore = null;
  let lastRank = 0;

  const ranked = users.map((u, index) => {
    if (u.totalScore === lastScore) {
      // same rank
    } else {
      lastRank = index + 1;
    }

    lastScore = u.totalScore;

    return {
      userId: u._id.toString(),
      rank: lastRank,
      totalScore: u.totalScore,
      percentile: ((total - index - 1) / total) * 100,
    };
  });

  return { ranked, total };
};
const checkAndQualifyUser = async (userId, completedPhase) => {
  const config = PHASE_CONFIG[completedPhase];
  if (!config) return null;

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const { ranked, total } = await calculateRanks();
  const userRankInfo = ranked.find((r) => r.userId === userId.toString());

  if (!userRankInfo) throw new Error('Could not compute rank');

  const threshold = config.scoreThreshold();
  const topPercentage = config.topPercentage();
  const cutoffRank = Math.ceil((topPercentage / 100) * total);

  const qualifiesByScore = userRankInfo.totalScore >= threshold;
  const qualifiesByRank = userRankInfo.rank <= cutoffRank;
  const isQualified = qualifiesByScore || qualifiesByRank;

  logger.info(
    `Qualification check for user ${userId} after phase ${completedPhase}: ` +
    `score=${userRankInfo.totalScore}, rank=${userRankInfo.rank}/${total}, ` +
    `threshold=${threshold}, cutoffRank=${cutoffRank}, qualified=${isQualified}`
  );

  if (isQualified) {
    const phasePassword = generatePhasePassword();

    const update = {
      isQualified: true,
      
      rank: userRankInfo.rank,
    };
    update[`phasePasswords.${config.passwordField}.password`] = phasePassword;
    update[`phasePasswords.${config.passwordField}.generatedAt`] = new Date();
    update[`phasePasswords.${config.passwordField}.used`] = false;

    await User.findByIdAndUpdate(userId, { $set: update });

    logger.info(`User ${userId} qualified for phase ${config.nextPhase}, password generated`);

    return {
      qualified: true,
      nextPhase: config.nextPhase,
      phasePassword,
      rank: userRankInfo.rank,
      totalUsers: total,
    };
  } else {
    await User.findByIdAndUpdate(userId, {
      $set: { isQualified: false, status: 'eliminated', rank: userRankInfo.rank },
    });

    logger.info(`User ${userId} eliminated after phase ${completedPhase}`);

    return {
      qualified: false,
      rank: userRankInfo.rank,
      totalUsers: total,
    };
  }
};

const updateAllRanks = async () => {
  const { ranked } = await calculateRanks();
  const bulkOps = ranked.map((r) => ({
    updateOne: {
      filter: { _id: r.userId },
      update: { $set: { rank: r.rank } },
    },
  }));
  if (bulkOps.length > 0) {
    await User.bulkWrite(bulkOps);
  }
};

module.exports = { checkAndQualifyUser, calculateRanks, updateAllRanks };
