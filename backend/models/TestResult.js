const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  url: { type: String, required: true },
  method: { type: String, required: true },
  overallStatus: { type: String, enum: ['PASS', 'FAIL'], default: 'PASS' },
  totalTests: { type: Number, default: 0 },
  passedTests: { type: Number, default: 0 },
  failedTests: { type: Number, default: 0 },
  results: [
    {
      name: String,
      input: mongoose.Schema.Types.Mixed,
      expectedStatus: Number,
      actualStatus: Number,
      status: { type: String, enum: ['PASS', 'FAIL_AFTER_RETRY'] },
      responseTime: Number,
      retryCount: Number,
      requestBody: mongoose.Schema.Types.Mixed,
      responseBody: mongoose.Schema.Types.Mixed,
      aiExplanation: String,
      aiFixSuggestion: String,
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', testResultSchema);
