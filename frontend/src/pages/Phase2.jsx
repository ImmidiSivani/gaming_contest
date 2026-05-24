import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { getQuestions } from "../services/questionService";
import { submitDebug, runDebug } from "../services/submissionService";
import { getProfile } from "../services/authService";

export default function Phase2() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState(63);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());

  useEffect(() => {
    getQuestions(2, 'DEBUG')
      .then((res) => {
        setQuestions(res.data.data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Phase2 error:', err);
        setError(err.response?.data?.message || 'Failed to load questions');
        setLoading(false);
      });
    
    getProfile()
      .then((res) => {
        setCurrentScore(res.data.data.phase2Score || 0);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    const q = questions[current];
    setCode(q.starterCode || q.code || "");
    setLanguageId(q.languageId || 63);
    setRunResult(null);
    setSubmitResult(null);
    setHintsUsed(0);
  }, [questions, current]);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!questions.length) return <div>No questions available</div>;

  const q = questions[current];
  const sampleTestCases = q.testCases?.filter((tc) => !tc.isHidden) || [];

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await submitDebug({
        questionId: q._id,
        code,
        languageId,
        hintsUsed,
      });

      setSubmitResult(res.data.data);
      setAttemptedQuestions((prev) => new Set([...prev, q._id]));
      setCurrentScore((prev) => prev + (res.data.data.score || 0));

      if (res.data.data?.phaseCompletion?.qualification?.phasePassword) {
        alert(`🎉 Congratulations! You've qualified for Phase 3!\nPassword: ${res.data.data.phaseCompletion.qualification.phasePassword}`);
      }

      if (current < questions.length - 1) {
        setTimeout(() => {
          setCurrent(current + 1);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      alert('Please write some code before running.');
      return;
    }

    setRunning(true);
    setRunResult(null);

    try {
      const res = await runDebug({
        questionId: q._id,
        code,
        languageId,
      });
      setRunResult(res.data.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Run failed.');
    } finally {
      setRunning(false);
    }
  };

  const useHint = () => {
    if (q.hints && q.hints.length > hintsUsed) {
      setHintsUsed(hintsUsed + 1);
    }
  };

  const attemptedCount = attemptedQuestions.size;
  const totalQuestions = questions.length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2>Phase 2 - Debugging</h2>
        <div className="text-right">
          <p>Score: <strong>{currentScore}</strong></p>
          <p className="text-sm text-gray-600">Progress: {attemptedCount}/{totalQuestions} attempted</p>
        </div>
      </div>
      
      <p className="text-yellow-600 bg-yellow-50 p-2 rounded mb-4">
        ℹ️ You must attempt ALL {totalQuestions} questions to complete this phase and qualify for Phase 3.
      </p>

      <div className="mb-4">
        <h3 className="text-xl font-bold">{q.title}</h3>
        <p className="mt-2">{q.description}</p>
      </div>

      <div className="mb-4">
        {q.hints?.slice(0, hintsUsed).map((h, i) => (
          <div key={i} className="text-yellow-600 bg-yellow-50 p-2 rounded mb-2">
            💡 Hint {i + 1}: {h}
          </div>
        ))}
      </div>

      <button 
        onClick={useHint} 
        disabled={hintsUsed >= (q.hints?.length || 0)}
        className="bg-yellow-300 px-4 py-2 rounded disabled:opacity-50 mb-4"
      >
        {hintsUsed >= (q.hints?.length || 0) ? 'No more hints' : `Use Hint (${hintsUsed}/${q.hints?.length || 0})`}
      </button>

      <div className="mb-4">
        <label className="font-bold mr-2">Language:</label>
        <select
          value={languageId}
          onChange={(e) => setLanguageId(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={63}>JavaScript</option>
          <option value={62}>Java</option>
          <option value={52}>C</option>
          <option value={54}>C++</option>
          <option value={4}>PHP</option>
          <option value={10}>Ruby</option>
          <option value={71}>Python</option>
          <option value={43}>Plain Text</option>
        </select>
      </div>

      <Editor
        height="420px"
        language={
          languageId === 63 ? 'javascript' :
          languageId === 62 ? 'java' :
          languageId === 52 ? 'c' :
          languageId === 54 ? 'cpp' :
          languageId === 4 ? 'php' :
          languageId === 10 ? 'ruby' :
          languageId === 71 ? 'python' :
          'plaintext'
        }
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
        }}
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleRun}
          disabled={running}
          className="bg-blue-500 text-white px-5 py-2 rounded disabled:bg-blue-300"
        >
          {running ? 'Running...' : 'Run'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-500 text-white px-5 py-2 rounded disabled:bg-green-300"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {sampleTestCases.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-bold mb-2">Sample Test Cases</h4>
          {sampleTestCases.map((tc, index) => (
            <div key={index} className="mb-3">
              <div className="font-semibold">Input #{index + 1}</div>
              <pre className="bg-white p-2 rounded mt-1">{tc.input}</pre>
            </div>
          ))}
        </div>
      )}

      {runResult && (
        <div className="mt-4 p-4 rounded bg-blue-50 border border-blue-200">
          <h4 className="font-bold mb-2">Run Results</h4>
          <p>Passed: {runResult.passedCount}/{runResult.totalCount}</p>
          {runResult.results?.map((item, idx) => (
            <div key={idx} className="mt-3 p-3 bg-white rounded border">
              <div className="font-semibold">Test #{idx + 1}: {item.passed ? '✅ Passed' : '❌ Failed'}</div>
              <div className="mt-1">Status: {item.statusDescription}</div>
              {item.actualOutput !== undefined && (
                <div className="mt-1">
                  <strong>Output:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-1">{item.actualOutput || '(empty)'}</pre>
                </div>
              )}
              {item.stderr && (
                <div className="mt-1 text-red-600">
                  <strong>Error:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-1">{item.stderr}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {submitResult && (
        <div className="mt-4 p-4 rounded bg-green-50 border border-green-200">
          <h4 className="font-bold mb-2">Submission Result</h4>
          <p>Status: {submitResult.status}</p>
          <p>Score: {submitResult.score}</p>
          <p>Passed: {submitResult.passedCount}/{submitResult.totalCount}</p>
          {submitResult.penalty > 0 && <p className="text-red-600">Penalty: -{submitResult.penalty}</p>}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            setCurrent(Math.max(0, current - 1));
            setSubmitResult(null);
            setRunResult(null);
          }}
          disabled={current === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => {
            setCurrent(Math.min(questions.length - 1, current + 1));
            setSubmitResult(null);
            setRunResult(null);
          }}
          disabled={current === questions.length - 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {attemptedCount === totalQuestions && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-700 font-bold">✓ All questions attempted! Wait for qualification results.</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}