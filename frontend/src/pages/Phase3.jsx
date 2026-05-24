import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { getQuestions } from "../services/questionService";
import { submitCode } from "../services/submissionService";
import { getProfile } from "../services/authService";

const LANGUAGE_OPTIONS = [
  { id: 63, name: "JavaScript" },
  { id: 62, name: "Java" },
  { id: 52, name: "C" },
  { id: 54, name: "C++" },
  { id: 4, name: "PHP" },
  { id: 10, name: "Ruby" },
  { id: 71, name: "Python" },
  { id: 43, name: "Plain Text" },
];

const LANGUAGE_MAP = {
  JavaScript: "javascript",
  Java: "java",
  C: "c",
  "C++": "cpp",
  PHP: "php",
  Ruby: "ruby",
  Python: "python",
  "Plain Text": "plaintext",
};

export default function Phase3() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState(63);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());

  useEffect(() => {
    getQuestions(3, 'CODING')
      .then((res) => {
        setQuestions(res.data.data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load questions');
        setLoading(false);
      });
    
    // Get current score
    getProfile()
      .then((res) => {
        setCurrentScore(res.data.data.phase3Score || 0);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code');
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const res = await submitCode({
        questionId: questions[current]._id,
        code,
        languageId,
      });
      
      setResult(res.data.data);
      
      // Track attempted question
      setAttemptedQuestions(prev => new Set([...prev, questions[current]._id]));
      
      // Update score
      setCurrentScore(prev => prev + (res.data.data.score || 0));
      
      alert(res.data.message || 'Code submitted successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setCode("");
      setResult(null);
    }
  };

  const handlePrevQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setCode("");
      setResult(null);
    }
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!questions.length) return <div>No coding questions available</div>;

  const q = questions[current];
  const attemptedCount = attemptedQuestions.size;
  const totalQuestions = questions.length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2>Phase 3 - Coding</h2>
        <div className="text-right">
          <p>Score: <strong>{currentScore}</strong></p>
          <p className="text-sm text-gray-600">Progress: {attemptedCount}/{totalQuestions} attempted</p>
        </div>
      </div>

      {/* Question Info */}
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="text-xl font-bold">{q.title}</h3>
        <p className="mt-2">{q.description}</p>
        
        {q.inputFormat && (
          <div className="mt-2">
            <strong>Input Format:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">{q.inputFormat}</pre>
          </div>
        )}
        
        {q.outputFormat && (
          <div className="mt-2">
            <strong>Output Format:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">{q.outputFormat}</pre>
          </div>
        )}
        
        {q.sampleInput && q.sampleOutput && (
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <strong>Sample Input:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1">{q.sampleInput}</pre>
            </div>
            <div>
              <strong>Sample Output:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1">{q.sampleOutput}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="mr-2 font-bold">Language:</label>
        <select
          value={languageId}
          onChange={(e) => setLanguageId(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <Editor
        height="400px"
        language={LANGUAGE_MAP[LANGUAGE_OPTIONS.find(l => l.id === languageId)?.name] || "javascript"}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />

      {/* Submit Button */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-500 text-white px-6 py-2 rounded disabled:bg-green-300"
        >
          {submitting ? 'Running...' : 'Submit Code'}
        </button>

        <button
          onClick={handlePrevQuestion}
          disabled={current === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={current === questions.length - 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 p-4 rounded bg-gray-100">
          <p className="text-lg font-bold">
            Status: {result.status || 'Completed'}
          </p>
          <p>Score: {result.score}</p>
          {result.passedCount !== undefined && (
            <p>Test Cases Passed: {result.passedCount}/{result.totalCount}</p>
          )}
          {result.stdout && (
            <div className="mt-2">
              <strong>Output:</strong>
              <pre className="bg-white p-2 rounded mt-1">{result.stdout}</pre>
            </div>
          )}
          {result.stderr && (
            <div className="mt-2 text-red-500">
              <strong>Error:</strong>
              <pre className="bg-white p-2 rounded mt-1">{result.stderr}</pre>
            </div>
          )}
          {result.score !== undefined && (
            <p className="mt-2">Score: {result.score}/{result.maxScore || 100}</p>
          )}
        </div>
      )}
    </div>
  );
}