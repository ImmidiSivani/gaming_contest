import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions } from "../services/questionService";
import { submitMCQ } from "../services/submissionService";
import { getProfile } from "../services/authService";

export default function Phase1() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    getQuestions(1, 'MCQ')
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
        setCurrentScore(res.data.data.phase1Score || 0);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (qId, answer) => {
    setSubmitting(true);
    try {
      const res = await submitMCQ({ questionId: qId, answer });
      
      // Track submitted answers
      setSubmittedAnswers(prev => ({ ...prev, [qId]: answer }));
      
      // Update score from response
      if (res.data.data?.score !== undefined) {
        setCurrentScore(res.data.data.score);
      }
      
      if (res.data.data?.phaseCompletion?.qualification?.phasePassword) {
        alert(`🎉 Congratulations! You've qualified for Phase 2!\nPassword: ${res.data.data.phaseCompletion.qualification.phasePassword}`);
      } else {
        alert(res.data.message || 'Answer submitted');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const attemptedCount = Object.keys(submittedAnswers).length;
  const totalQuestions = questions.length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Phase 1 - MCQ</h2>
        <div className="text-right">
          <p>Score: <strong>{currentScore}</strong></p>
          <p className="text-sm text-gray-600">Progress: {attemptedCount}/{totalQuestions} attempted</p>
        </div>
      </div>
      
      <p className="text-yellow-600 bg-yellow-50 p-2 rounded mb-4">
        ℹ️ You must attempt ALL {totalQuestions} questions to complete this phase and qualify for Phase 2.
      </p>

      {questions.map((q) => (
        <div key={q._id} className="mb-4 p-4 border rounded">
          <h3 className="font-bold">{q.title}</h3>
          <p className="text-sm text-gray-600">Marks: {q.marks} | Negative: {q.negativeMarks || 0}</p>
          <div className="flex gap-2 mt-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(q._id, opt)}
                disabled={submitting || submittedAnswers[q._id]}
                className={`px-4 py-2 rounded ${
                  submittedAnswers[q._id] === opt 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                } ${submitting || submittedAnswers[q._id] ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {submittedAnswers[q._id] && (
            <p className="text-green-600 mt-2">✓ Answer submitted</p>
          )}
        </div>
      ))}

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