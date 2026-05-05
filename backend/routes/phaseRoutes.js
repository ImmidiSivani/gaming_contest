const express = require('express');
const router = express.Router();
const phaseController = require('../controllers/phaseController');
const { protect } = require('../middleware/authMiddleware');
const { phaseUnlockValidation } = require('../middleware/validateInput');

router.post('/unlock', protect, phaseUnlockValidation, phaseController.unlockPhase);

module.exports = router;
