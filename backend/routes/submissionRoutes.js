const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { protect, requireActiveStatus } = require('../middleware/authMiddleware');
const {
  mcqSubmissionValidation,
  debugSubmissionValidation,
  codeSubmissionValidation,
} = require('../middleware/validateInput');

router.use(protect, requireActiveStatus);

router.post('/mcq', mcqSubmissionValidation, submissionController.submitMCQ);
router.post('/debug', debugSubmissionValidation, submissionController.submitDebug);
router.post('/code', codeSubmissionValidation, submissionController.submitCode);
router.get('/my', submissionController.getUserSubmissions);

module.exports = router;
