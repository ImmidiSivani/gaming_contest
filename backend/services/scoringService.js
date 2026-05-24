const calculateMCQScore = ({ isCorrect, marks, negativeMarks }) => {
  if (isCorrect) {
    return { score: marks, penalty: 0 };
  }
  return { score: 0, penalty: negativeMarks || 0 };
};

const calculateDebugScore = ({ passedTestCases, totalTestCases, marks, wrongSubmissionPenalty, hintsUsed = 0, hintPenalty = 0, isFirstAttempt = true }) => {
  if (totalTestCases === 0) return { score: 0, penalty: 0 };

  const ratio = passedTestCases / totalTestCases;
  const baseScore = Math.floor((marks || 0) * ratio);
  const hintDeduction = (hintsUsed || 0) * (hintPenalty || 0);
  const score = Math.max(0, baseScore - hintDeduction);
  const penalty = (!isFirstAttempt && passedTestCases < totalTestCases) ? (wrongSubmissionPenalty || 0) : 0;

  return { score, penalty };
};

const calculateCodingScore = ({ passedTestCases, totalTestCases, marks, wrongSubmissionPenalty, isFirstAttempt }) => {
  if (totalTestCases === 0) return { score: 0, penalty: 0 };

  const ratio = passedTestCases / totalTestCases;
  const earnedScore = Math.floor(marks * ratio);
  const penalty = (!isFirstAttempt && passedTestCases < totalTestCases) ? (wrongSubmissionPenalty || 0) : 0;

  return { score: earnedScore, penalty };
};

const computeNetScore = (score, penalty) => {
  return Math.max(0, score - penalty);
};

module.exports = {
  calculateMCQScore,
  calculateDebugScore,
  calculateCodingScore,
  computeNetScore,
};
