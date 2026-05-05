// 

const axios = require('axios');
const logger = require('../utils/logger');

// ✅ PUBLIC Judge0 (NO API KEY)
const JUDGE0_API_URL = 'https://ce.judge0.com';

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 15;

// ✅ No API key needed
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// 🔹 Submit code
const submitCode = async ({ sourceCode, languageId, stdin = '' }) => {
  try {
    const payload = {
      source_code: Buffer.from(sourceCode).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(stdin).toString('base64'),
      base64_encoded: true,
    };

    const res = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`,
      payload,
      { headers: getHeaders() }
    );

    return res.data.token;
  } catch (error) {
    logger.error(`Submit error: ${error.message}`);
    throw new Error('Failed to submit code');
  }
};

// 🔹 Poll result
const pollResult = async (token) => {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const res = await axios.get(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`,
      { headers: getHeaders() }
    );

    const result = res.data;
    const statusId = result.status?.id;

    // 1,2 = In Queue / Processing
    if (statusId <= 2) continue;

    return {
      statusId,
      statusDescription: result.status?.description,
      stdout: result.stdout
        ? Buffer.from(result.stdout, 'base64').toString()
        : '',
      stderr: result.stderr
        ? Buffer.from(result.stderr, 'base64').toString()
        : '',
      compileOutput: result.compile_output
        ? Buffer.from(result.compile_output, 'base64').toString()
        : '',
      time: result.time ? parseFloat(result.time) : null,
      memory: result.memory || null,
    };
  }

  throw new Error('Execution timed out');
};

// 🔹 Run single test case
const runTestCase = async ({ sourceCode, languageId, input, expectedOutput }) => {
  try {
    const token = await submitCode({
      sourceCode,
      languageId,
      stdin: input,
    });

    const result = await pollResult(token);

    const actualOutput = result.stdout.trim();
    const expected = expectedOutput.trim();

    const passed =
      result.statusId === 3 && actualOutput === expected;

    return {
      passed,
      actualOutput,
      expectedOutput: expected,
      statusDescription: result.statusDescription,
      executionTime: result.time,
      memory: result.memory,
      stderr: result.stderr,
    };
  } catch (error) {
    logger.error(`Test case error: ${error.message}`);

    return {
      passed: false,
      actualOutput: '',
      expectedOutput,
      statusDescription: 'Execution Error',
      executionTime: null,
      memory: null,
      stderr: error.message,
    };
  }
};

// 🔹 Run all test cases
const runAllTestCases = async ({ sourceCode, languageId, testCases }) => {
  const results = [];

  for (const tc of testCases) {
    const res = await runTestCase({
      sourceCode,
      languageId,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    });
    results.push(res);
  }

  const passedCount = results.filter((r) => r.passed).length;

  return {
    results,
    passedCount,
    totalCount: testCases.length,
    allPassed: passedCount === testCases.length,
  };
};

module.exports = {
  runTestCase,
  runAllTestCases,
};