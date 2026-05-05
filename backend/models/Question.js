const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['MCQ', 'DEBUG', 'CODING'],
      required: [true, 'Question type is required'],
    },
    phase: {
      type: Number,
      enum: [1, 2, 3],
      required: [true, 'Phase is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    options: {
      type: [String],
      default: undefined,
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: 0,
    },
    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    hintPenalty: {
      type: Number,
      default: 0,
      min: 0,
    },
    wrongSubmissionPenalty: {
      type: Number,
      default: 0,
      min: 0,
    },
    hints: {
      type: [String],
      default: [],
    },
    testCases: {
      type: [testCaseSchema],
      default: undefined,
    },
    starterCode: {
      type: String,
      default: '',
    },
    languageId: {
      type: Number,
      default: 71,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ phase: 1, type: 1 });

module.exports = mongoose.model('Question', questionSchema);
