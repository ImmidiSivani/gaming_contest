const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      trim: true,
    },
    currentPhase: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    phase1Score: {
      type: Number,
      default: 0,
    },
    phase2Score: {
      type: Number,
      default: 0,
    },
    phase3Score: {
      type: Number,
      default: 0,
    },
    phase1Completed: {
      type: Boolean,
      default: false,
    },
    phase2Completed: {
      type: Boolean,
      default: false,
    },
    phase3Completed: {
      type: Boolean,
      default: false,
    },
    isQualified: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'eliminated'],
      default: 'active',
    },
    phasePasswords: {
      phase2: {
        password: { type: String, default: null },
        generatedAt: { type: Date, default: null },
        used: { type: Boolean, default: false },
      },
      phase3: {
        password: { type: String, default: null },
        generatedAt: { type: Date, default: null },
        used: { type: Boolean, default: false },
      },
    },
    rank: {
      type: Number,
      default: null,
    },
    role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
},
  },
  {
    timestamps: true,
  },
);

userSchema.index({ totalScore: -1 });

module.exports = mongoose.model('User', userSchema);
