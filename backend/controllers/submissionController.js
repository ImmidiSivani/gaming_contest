const submissionService = require('../services/submissionService');
const Submission = require('../models/Submission');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const submitMCQ = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const io = req.app.get('io');

    const result = await submissionService.submitMCQ({
      userId: req.user._id,
      questionId,
      answer,
      io,
    });

    const phaseCheck = await submissionService.checkPhaseCompletion({
      userId: req.user._id,
      phase: 1,
      io,
    });

    return successResponse(res, 'MCQ submitted successfully', {
      ...result,
      phaseCompletion: phaseCheck,
    });
  } catch (error) {
    next(error);
  }
};

const runDebug = async (req, res, next) => {
  try {
    const { questionId, code, languageId } = req.body;
    const result = await submissionService.runDebug({
      userId: req.user._id,
      questionId,
      code,
      languageId,
    });

    return successResponse(res, 'Debug run successful', {
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const submitDebug = async (req, res, next) => {
  try {
    const { questionId, code, languageId, hintsUsed } = req.body;
    const io = req.app.get('io');

    const result = await submissionService.submitDebug({
      userId: req.user._id,
      questionId,
      code,
      languageId,
      hintsUsed: hintsUsed || 0,
      io,
    });

    const phaseCheck = await submissionService.checkPhaseCompletion({
      userId: req.user._id,
      phase: 2,
      io,
    });

    return successResponse(res, 'Debug submission successful', {
      ...result,
      phaseCompletion: phaseCheck,
    });
  } catch (error) {
    next(error);
  }
};

const submitCode = async (req, res, next) => {
  try {
    const { questionId, code, languageId } = req.body;
    const io = req.app.get('io');

    const result = await submissionService.submitCode({
      userId: req.user._id,
      questionId,
      code,
      languageId,
      io,
    });

    const phaseCheck = await submissionService.checkPhaseCompletion({
      userId: req.user._id,
      phase: 3,
      io,
    });

    return successResponse(res, 'Code submission successful', {
      ...result,
      phaseCompletion: phaseCheck,
    });
  } catch (error) {
    next(error);
  }
};

const getUserSubmissions = async (req, res, next) => {
  try {
    const phase = req.query.phase ? parseInt(req.query.phase) : undefined;
    const query = { userId: req.user._id };
    if (phase) query.phase = phase;

    const submissions = await Submission.find(query)
      .populate('questionId', 'title type phase marks')
      .sort({ createdAt: -1 });

    return successResponse(res, 'Submissions retrieved', { submissions });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitMCQ, runDebug, submitDebug, submitCode, getUserSubmissions };