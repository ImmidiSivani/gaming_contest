const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { protect, requireAdmin} = require('../middleware/authMiddleware');

router.get('/:phase', protect, questionController.getQuestionsByPhase);

router.post('/', protect, requireAdmin, questionController.createQuestion);
router.put('/:id', protect, requireAdmin, questionController.updateQuestion);
router.delete('/:id', protect, requireAdmin, questionController.deleteQuestion);
module.exports = router;
