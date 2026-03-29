require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const { generateTestCases, explainFailure } = require('./utils/gemini');
const TestResult = require('./models/TestResult');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (optional but included as bonus)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.post('/generate-tests', async (req, res) => {
  const { url, method, body } = req.body;
  if (!url || !method) {
    return res.status(400).json({ error: 'URL and Method are required.' });
  }
  
  try {
    const testCases = await generateTestCases(url, method, body);
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/run-tests', async (req, res) => {
  const { url, method, testCases } = req.body;
  if (!url || !method || !testCases || !Array.isArray(testCases)) {
    return res.status(400).json({ error: 'Invalid payload.' });
  }

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  const MAX_CONCURRENT = 5;
  for (let i = 0; i < testCases.length; i += MAX_CONCURRENT) {
    const chunk = testCases.slice(i, i + MAX_CONCURRENT);
    const chunkResults = await Promise.all(chunk.map(async (test) => {
      let attempt = 0;
      const maxRetries = 2;
      let delay = 300;
      
      let currentActualStatus;
      let currentActualResponse;
      let currentResponseTime;
      let testPassed = false;

      while (attempt <= maxRetries && !testPassed) {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.floor(delay * 1.5);
        }
        
        const startTime = Date.now();
        try {
          const response = await axios({
            url,
            method,
            data: method !== 'GET' ? test.input : undefined,
            params: method === 'GET' ? test.input : undefined,
            validateStatus: () => true,
            timeout: 10000
          });
          
          currentResponseTime = Date.now() - startTime;
          currentActualStatus = response.status;
          currentActualResponse = response.data;
        } catch (error) {
          currentResponseTime = Date.now() - startTime;
          currentActualStatus = error.response ? error.response.status : 503;
          currentActualResponse = error.message;
        }

        if (currentActualStatus === test.expectedStatus) {
          testPassed = true;
        } else if (currentActualStatus >= 500 || currentActualStatus === 429) {
          attempt++;
        } else {
          attempt++;
        }
      }

      const testStatus = testPassed ? 'PASS' : 'FAIL_AFTER_RETRY';
      let aiExplanation = null;
      let aiFixSuggestion = null;

      if (!testPassed) {
        const aiResponse = await explainFailure(
          url, 
          method, 
          test.input, 
          test.expectedStatus, 
          currentActualStatus, 
          currentActualResponse
        );
        aiExplanation = aiResponse.explanation;
        aiFixSuggestion = aiResponse.fixSuggestion;
      }

      return {
        name: test.name,
        input: test.input,
        expectedStatus: test.expectedStatus,
        actualStatus: currentActualStatus,
        status: testStatus,
        responseTime: currentResponseTime,
        retryCount: attempt > 0 && testPassed ? attempt : (attempt > maxRetries ? maxRetries : attempt),
        requestBody: test.input,
        responseBody: currentActualResponse,
        aiExplanation,
        aiFixSuggestion
      };
    }));

    for (const res of chunkResults) {
      if (res.status === 'PASS') passedCount++;
      else failedCount++;
      results.push(res);
    }
  }

  const overallStatus = failedCount === 0 ? 'PASS' : 'FAIL';

  // Save to DB
  let savedId = null;
  if (mongoose.connection.readyState === 1) {
    try {
      const newResult = new TestResult({
        url,
        method,
        overallStatus,
        totalTests: testCases.length,
        passedTests: passedCount,
        failedTests: failedCount,
        results
      });
      const savedResult = await newResult.save();
      savedId = savedResult._id;
    } catch (err) {
      console.error('Error saving result to DB:', err);
    }
  }

  res.json({
    summary: {
      url,
      method,
      totalTests: testCases.length,
      passedTests: passedCount,
      failedTests: failedCount,
      overallStatus,
      dbId: savedId
    },
    results
  });
});

app.get('/results', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected.' });
  }
  try {
    const history = await TestResult.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
