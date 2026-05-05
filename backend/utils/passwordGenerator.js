const crypto = require('crypto');

const generatePhasePassword = () => {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = { generatePhasePassword, generateSecureToken };
