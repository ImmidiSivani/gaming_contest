const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseFormatter');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('collegeName').optional().trim(),
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const mcqSubmissionValidation = [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('answer').notEmpty().withMessage('Answer is required'),
  handleValidationErrors,
];

const debugSubmissionValidation = [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('code').notEmpty().withMessage('Code is required'),
  body('languageId').isInt({ min: 1 }).withMessage('Valid language ID is required'),
  body('hintsUsed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('hintsUsed must be a non-negative integer'),
  handleValidationErrors,
];

const debugRunValidation = [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('code').notEmpty().withMessage('Code is required'),
  body('languageId').isInt({ min: 1 }).withMessage('Valid language ID is required'),
  handleValidationErrors,
];

const codeSubmissionValidation = [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('code').notEmpty().withMessage('Code is required'),
  body('languageId').isInt({ min: 1 }).withMessage('Valid language ID is required'),
  handleValidationErrors,
];

const phaseUnlockValidation = [
  body('phase').isInt({ min: 2, max: 3 }).withMessage('Phase must be 2 or 3'),
  body('password').notEmpty().withMessage('Phase password is required'),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  mcqSubmissionValidation,
  debugSubmissionValidation,
  debugRunValidation,
  codeSubmissionValidation,
  phaseUnlockValidation,
};
