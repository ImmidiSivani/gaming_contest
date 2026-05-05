const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    phase: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    submittedAnswer: {
      type: String,
      default: null,
    },
    submittedCode: {
      type: String,
      default: null,
    },
    languageId: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['correct', 'wrong', 'partial', 'pending', 'error'],
      default: 'pending',
    },
    score: {
      type: Number,
      default: 0,
    },
    penalty: {
      type: Number,
      default: 0,
    },
    hintsUsed: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    testCaseResults: [
      {
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        executionTime: Number,
        memory: Number,
        _id: false,
      },
    ],
    judge0Token: {
      type: String,
      default: null,
    },
    executionTime: {
      type: Number,
      default: null,
    },
    memoryUsed: {
      type: Number,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ userId: 1, questionId: 1 });
submissionSchema.index({ userId: 1, phase: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
