const phaseService = require('../services/phaseService');
const { successResponse } = require('../utils/responseFormatter');

const unlockPhase = async (req, res, next) => {
  try {
    const { phase, password } = req.body;
    const io = req.app.get('io');

    const result = await phaseService.validateAndUnlockPhase(
      req.user._id,
      parseInt(phase),
      password
    );

    // Get updated user data
    const User = require('../models/User');
    const updatedUser = await User.findById(req.user._id).select('-password');

    if (io) {
      io.to(req.user._id.toString()).emit('phaseUnlocked', {
        userId: req.user._id,
        unlockedPhase: result.unlockedPhase,
      });
    }

    return successResponse(res, result.message, { 
      unlockedPhase: result.unlockedPhase,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { unlockPhase };
