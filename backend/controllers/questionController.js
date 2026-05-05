const Question = require('../models/Question');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const getQuestionsByPhase = async (req, res, next) => {
  try {
    const phase = parseInt(req.params.phase);

    if (![1, 2, 3].includes(phase)) {
      return errorResponse(res, 'Invalid phase. Must be 1, 2, or 3', 400);
    }

    if (req.user.currentPhase < phase) {
      return errorResponse(res, `You must unlock phase ${phase} first`, 403);
    }

    const filter = { phase, isActive: true };
    if (req.query.type) {
      filter.type = req.query.type.toUpperCase();
    }

    const questions = await Question.find(filter)
      .select('-correctAnswer -testCases.expectedOutput')
      .sort({ order: 1, createdAt: 1 });

    return successResponse(res, 'Questions retrieved', { phase, questions });
  } catch (error) {
    next(error);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    return successResponse(res, 'Question created', { question }, 201);
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }
    return successResponse(res, 'Question updated', { question });
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }
    return successResponse(res, 'Question deactivated');
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestionsByPhase, createQuestion, updateQuestion, deleteQuestion };
