const User = require('../models/User');
const logger = require('../utils/logger');

const PHASE_PASSWORD_MAP = {
  2: 'phase2',
  3: 'phase3',
};

const validateAndUnlockPhase = async (userId, targetPhase, providedPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.status === 'eliminated') {
    const error = new Error('You have been eliminated and cannot unlock further phases');
    error.statusCode = 403;
    throw error;
  }

  if (!user.isQualified) {
    const error = new Error('You did not qualify for the next phase');
    error.statusCode = 403;
    throw error;
  }

  if (user.currentPhase >= targetPhase) {
    const error = new Error(`Phase ${targetPhase} is already unlocked`);
    error.statusCode = 400;
    throw error;
  }

  const passwordKey = PHASE_PASSWORD_MAP[targetPhase];
  if (!passwordKey) {
    const error = new Error('Invalid phase');
    error.statusCode = 400;
    throw error;
  }

  const storedPasswordData = user.phasePasswords[passwordKey];

  if (!storedPasswordData || !storedPasswordData.password) {
    const error = new Error('No phase password found. You may not have qualified yet');
    error.statusCode = 403;
    throw error;
  }

  if (storedPasswordData.used) {
    const error = new Error('Phase password has already been used');
    error.statusCode = 400;
    throw error;
  }

  const expiryHours = parseInt(process.env.PHASE_PASSWORD_EXPIRY_HOURS) || 24;
  const expiryTime = new Date(storedPasswordData.generatedAt);
  expiryTime.setHours(expiryTime.getHours() + expiryHours);

  if (new Date() > expiryTime) {
    const error = new Error('Phase password has expired');
    error.statusCode = 400;
    throw error;
  }

  if (storedPasswordData.password !== providedPassword) {
    const error = new Error('Incorrect phase password');
    error.statusCode = 401;
    throw error;
  }

  await User.findByIdAndUpdate(userId, {
    $set: {
      currentPhase: targetPhase,
      [`phasePasswords.${passwordKey}.used`]: true,
    },
  });

  logger.info(`User ${userId} unlocked phase ${targetPhase}`);

  return {
    unlockedPhase: targetPhase,
    message: `Phase ${targetPhase} successfully unlocked`,
  };
};

module.exports = { validateAndUnlockPhase };
