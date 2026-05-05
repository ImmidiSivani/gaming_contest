const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, leaderboardController.getLeaderboard);
router.get('/top', protect, leaderboardController.getTopUsers);

module.exports = router;
