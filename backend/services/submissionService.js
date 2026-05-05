const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');
const scoringService = require('./scoringService');
const qualificationService = require('./qualificationService');
const judge0Service = require('./judge0Service');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const emitLeaderboardUpdate = async (io) => {
  try {
    const leaderboardService = require('./leaderboardService');
    const { leaderboard } = await leaderboardService.getLeaderboard({ limit: 20 });
    if (io) {
      io.emit('leaderboardUpdate', { leaderboard, timestamp: new Date() });
    }
  } catch (error) {
    logger.error(`Failed to emit leaderboard update: ${error.message}`);
  }
};

const getPreviousSubmission = async (userId, questionId) => {
  return Submission.findOne({ userId, questionId });
};
// ======================= MCQ =======================
const submitMCQ = async ({ userId, questionId, answer, io }) => {
  const question = await Question.findById(questionId);
  if (!question || question.type !== 'MCQ') {
    throw new AppError('MCQ question not found', 404);
  }

  const existingSubmission = await getPreviousSubmission(userId, questionId);

  if (existingSubmission && existingSubmission.status === 'correct') {
    throw new AppError('Already answered correctly', 400);
  }

  const isCorrect = answer.trim() === question.correctAnswer.trim();

  const { score, penalty } = scoringService.calculateMCQScore({
    isCorrect,
    marks: question.marks,
    negativeMarks: question.negativeMarks,
  });
  const attempts = existingSubmission ? existingSubmission.attempts + 1 : 1;
  let scoreDelta = isCorrect ? score : -penalty;
  const previousScore = existingSubmission ? existingSubmission.score : 0;
  const scoreChange = scoreDelta - previousScore;
  const submission = await Submission.create({
    userId,
    phase: question.phase,
    questionId,
    submittedAnswer: answer,
    status: isCorrect ? 'correct' : 'wrong',
    score: scoreDelta,
    penalty,
    attempts,
  });
  await User.findByIdAndUpdate(userId, {
    $inc: {
      totalScore: scoreChange,
      phase1Score: scoreChange,
    },
  });
  logger.info(`MCQ: user=${userId}, correct=${isCorrect}, score=${scoreDelta}`);
  await emitLeaderboardUpdate(io);

  return {
    submission,
    isCorrect,
    score: scoreDelta,
    penalty,
  };
};

// ======================= DEBUG =======================

const submitDebug = async ({ userId, questionId, answer, hintsUsed = 0, io }) => {
  const question = await Question.findById(questionId);
  if (!question || question.type !== 'DEBUG') {
    throw new AppError('Debug question not found', 404);
  }

  const existingSubmission = await getPreviousSubmission(userId, questionId);

  if (existingSubmission && existingSubmission.status === 'correct') {
    throw new AppError('Already solved', 400);
  }

  // Debug logging
  console.log('Debug submission:', {
    userId,
    questionId,
    answer: answer ? `"${answer}"` : 'undefined/null',
    correctAnswer: question.correctAnswer ? `"${question.correctAnswer}"` : 'undefined/null',
    answerType: typeof answer,
    correctAnswerType: typeof question.correctAnswer
  });

  if (!answer || typeof answer !== 'string') {
    throw new AppError('Answer must be a non-empty string', 400);
  }

  if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
    throw new AppError('Question correct answer is missing or invalid', 500);
  }

  const isCorrect = answer.trim() === question.correctAnswer.trim();

  const { score, penalty } = scoringService.calculateDebugScore({
  isCorrect,
  marks: question.marks,
  wrongSubmissionPenalty: question.wrongSubmissionPenalty, 
  hintsUsed,
  hintPenalty: question.hintPenalty,
});

  const attempts = existingSubmission ? existingSubmission.attempts + 1 : 1;

  let scoreDelta = isCorrect ? score : -penalty;

  const previousScore = existingSubmission ? existingSubmission.score : 0;
  const scoreChange = scoreDelta - previousScore;

  const submission = await Submission.create({
    userId,
    phase: question.phase,
    questionId,
    submittedAnswer: answer,
    status: isCorrect ? 'correct' : 'wrong',
    score: scoreDelta,
    penalty,
    hintsUsed,
    attempts,
  });

  await User.findByIdAndUpdate(userId, {
    $inc: {
      totalScore: scoreChange,
      phase2Score: scoreChange,
    },
  });

  logger.info(`DEBUG: user=${userId}, correct=${isCorrect}, score=${scoreDelta}`);

  await emitLeaderboardUpdate(io);

  return {
    submission,
    isCorrect,
    score: scoreDelta,
    penalty,
  };
};


// ======================= CODING =======================

const submitCode = async ({ userId, questionId, code, languageId, io }) => {
  const question = await Question.findById(questionId);
  if (!question || question.type !== 'CODING') {
    throw new Error('Coding question not found');
  }
  console.log("Coding penalty from DB:", question.wrongSubmissionPenalty);

  const existingSubmission = await getPreviousSubmission(userId, questionId);
  const attempts = existingSubmission ? existingSubmission.attempts + 1 : 1;

  const { results, passedCount, totalCount, allPassed } =
    await judge0Service.runAllTestCases({
      sourceCode: code,
      languageId,
      testCases: question.testCases,
    });

  const { score, penalty } = scoringService.calculateCodingScore({
    passedTestCases: passedCount,
    totalTestCases: totalCount,
    marks: question.marks,
    wrongSubmissionPenalty: question.wrongSubmissionPenalty,
    isFirstAttempt: !existingSubmission,
  });

  const status = allPassed ? 'correct' : passedCount > 0 ? 'partial' : 'wrong';

  // 🔥 FINAL LOGIC (supports partial scoring)
  let scoreDelta;

  if (status === 'correct' || status === 'partial') {
    scoreDelta = score;
  } else {
    scoreDelta = -penalty;
  }

  const previousScore = existingSubmission ? existingSubmission.score : 0;
  const scoreChange = scoreDelta - previousScore;

  const submission = await Submission.create({
    userId,
    phase: question.phase,
    questionId,
    submittedCode: code,
    languageId,
    status,
    score: scoreDelta,
    penalty,
    attempts,
    testCaseResults: results,
  });

  await User.findByIdAndUpdate(userId, {
    $inc: {
      totalScore: scoreChange,
      phase3Score: scoreChange,
    },
  });

  logger.info(`CODE: user=${userId}, status=${status}, score=${scoreDelta}`);

  await emitLeaderboardUpdate(io);

  return {
    submission,
    status,
    score: scoreDelta,
    penalty,
    passedCount,
    totalCount,
  };
};



// ======================= PHASE COMPLETION =======================

const checkPhaseCompletion = async ({ userId, phase, io }) => {
  const user = await User.findById(userId);

  const questions = await Question.find({ phase, isActive: true }).select('_id');
  const ids = questions.map((q) => q._id);

  const attempted = await Submission.find({
    userId,
    phase,
    questionId: { $in: ids },
  }).distinct('questionId');

  // Phase is only considered complete once the user has attempted all active questions
  if (attempted.length !== ids.length) {
    return { phaseCompleted: false };
  }

  const field = `phase${phase}Completed`;

  if (!user[field]) {
    await User.findByIdAndUpdate(userId, { $set: { [field]: true } });

    if (phase < 3) {
      const qualification = await qualificationService.checkAndQualifyUser(userId, phase);

      logger.info(`Phase ${phase} completed → Qualified=${qualification.qualified}`);

      return { phaseCompleted: true, qualification };
    }

    return { phaseCompleted: true };
  }

  return { phaseCompleted: true };
};

module.exports = {
  submitMCQ,
  submitDebug,
  submitCode,
  checkPhaseCompletion,
};