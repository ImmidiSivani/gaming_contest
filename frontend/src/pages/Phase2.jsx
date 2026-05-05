import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions } from "../services/questionService";
import { submitDebug } from "../services/submissionService";
import { getProfile } from "../services/authService";

export default function Phase2() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());

  useEffect(() => {
    console.log('Phase2 component loaded');
    getQuestions(2, 'DEBUG')
      .then((res) => {
        console.log('Phase2 questions loaded:', res.data);
        setQuestions(res.data.data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Phase2 error:', err);
        setError(err.response?.data?.message || 'Failed to load questions');
        setLoading(false);
      });
    
    // Get current score
    getProfile()
      .then((res) => {
        console.log('Phase2 user profile:', res.data.data);
        setCurrentScore(res.data.data.phase2Score || 0);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!questions.length) return <div>No questions available</div>;

  const q = questions[current];

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please enter an answer');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitDebug({
        questionId: q._id,
        answer,
        hintsUsed,
      });

      setResult(res.data.data);
      
      // Update score from response
      if (res.data.data?.score !== undefined) {
        setCurrentScore(res.data.data.score);
      }
      
      setSubmitting(false);
      
      // Track attempted question
      setAttemptedQuestions(prev => new Set([...prev, q._id]));

      // Check for qualification
      if (res.data.data?.phaseCompletion?.qualification?.phasePassword) {
        alert(`🎉 Congratulations! You've qualified for Phase 3!\nPassword: ${res.data.data.phaseCompletion.qualification.phasePassword}`);
      }

      // move to next question automatically
      if (current < questions.length - 1) {
        setTimeout(() => {
          setCurrent(current + 1);
          setAnswer("");
          setHintsUsed(0);
          setResult(null);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      alert(error.response?.data?.message || 'Submission failed.');
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
        
        {q.code && (
          <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
            <code>{q.code}</code>
          </pre>
        )}
      </div>

      {/* Show hints */}
      <div className="mb-4">
        {q.hints?.slice(0, hintsUsed).map((h, i) => (
          <div key={i} className="text-yellow-600 bg-yellow-50 p-2 rounded mb-1">
            💡 Hint {i + 1}: {h}
          </div>
        ))}
      </div>

      <button 
        onClick={useHint} 
        disabled={hintsUsed >= (q.hints?.length || 0)}
        className="bg-yellow-300 px-4 py-2 rounded disabled:opacity-50"
      >
        {hintsUsed >= (q.hints?.length || 0) ? 'No more hints' : `Use Hint (${hintsUsed}/${q.hints?.length || 0})`}
      </button>

      {/* Answer input */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Fix the bug / write correct output"
        className="w-full border p-2 mt-3 h-32"
        disabled={submitting}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded disabled:bg-blue-300"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-4 p-4 rounded bg-gray-100">
          <p className="text-lg">
            Result:{" "}
            {result.isCorrect ? "✅ Correct" : "❌ Wrong"}
          </p>
          <p>Score: {result.score}</p>
          {result.penalty > 0 && <p className="text-red-500">Penalty: -{result.penalty}</p>}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => { setCurrent(Math.max(0, current - 1)); setAnswer(""); setHintsUsed(0); setResult(null); }}
          disabled={current === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => { setCurrent(Math.min(questions.length - 1, current + 1)); setAnswer(""); setHintsUsed(0); setResult(null); }}
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
