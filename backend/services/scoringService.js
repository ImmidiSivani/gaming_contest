const calculateMCQScore = ({ isCorrect, marks, negativeMarks }) => {
  if (isCorrect) {
    return { score: marks, penalty: 0 };
  }
  return { score: 0, penalty: negativeMarks || 0 };
};

const calculateDebugScore = ({ isCorrect, marks, wrongSubmissionPenalty, hintsUsed, hintPenalty }) => {
  if (!isCorrect) {
    return { score: 0, penalty: wrongSubmissionPenalty || 0 };
  }

  const hintDeduction = (hintsUsed || 0) * (hintPenalty || 0);
  const finalScore = Math.max(0, marks - hintDeduction);

  return { score: finalScore, penalty: hintDeduction };
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
