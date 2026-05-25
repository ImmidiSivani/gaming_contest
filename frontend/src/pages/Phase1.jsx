// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getQuestions } from "../services/questionService";
// import { submitMCQ } from "../services/submissionService";
// import { getProfile } from "../services/authService";

// export default function Phase1() {
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submittedAnswers, setSubmittedAnswers] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [currentScore, setCurrentScore] = useState(0);

//   useEffect(() => {
//     getQuestions(1, 'MCQ')
//       .then((res) => {
//         setQuestions(res.data.data.questions);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError(err.response?.data?.message || 'Failed to load questions');
//         setLoading(false);
//       });
    
//     // Get current score
//     getProfile()
//       .then((res) => {
//         setCurrentScore(res.data.data.phase1Score || 0);
//       })
//       .catch(console.error);
//   }, []);

//   const handleSubmit = async (qId, answer) => {
//     setSubmitting(true);
//     try {
//       const res = await submitMCQ({ questionId: qId, answer });
      
//       // Track submitted answers
//       setSubmittedAnswers(prev => ({ ...prev, [qId]: answer }));
      
//       // Update score from response
//       if (res.data.data?.score !== undefined) {
//         setCurrentScore(res.data.data.score);
//       }
      
//       if (res.data.data?.phaseCompletion?.qualification?.phasePassword) {
//         alert(`🎉 Congratulations! You've qualified for Phase 2!\nPassword: ${res.data.data.phaseCompletion.qualification.phasePassword}`);
//       } else {
//         alert(res.data.message || 'Answer submitted');
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || 'Submission failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div>Loading questions...</div>;
//   if (error) return <div className="text-red-500">Error: {error}</div>;

//   const attemptedCount = Object.keys(submittedAnswers).length;
//   const totalQuestions = questions.length;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Phase 1 - MCQ</h2>
//         <div className="text-right">
//           <p>Score: <strong>{currentScore}</strong></p>
//           <p className="text-sm text-gray-600">Progress: {attemptedCount}/{totalQuestions} attempted</p>
//         </div>
//       </div>
      
//       <p className="text-yellow-600 bg-yellow-50 p-2 rounded mb-4">
//         ℹ️ You must attempt ALL {totalQuestions} questions to complete this phase and qualify for Phase 2.
//       </p>

//       {questions.map((q) => (
//         <div key={q._id} className="mb-4 p-4 border rounded">
//           <h3 className="font-bold">{q.title}</h3>
//           <p className="text-sm text-gray-600">Marks: {q.marks} | Negative: {q.negativeMarks || 0}</p>
//           <div className="flex gap-2 mt-2">
//             {q.options.map((opt, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => handleSubmit(q._id, opt)}
//                 disabled={submitting || submittedAnswers[q._id]}
//                 className={`px-4 py-2 rounded ${
//                   submittedAnswers[q._id] === opt 
//                     ? 'bg-green-500 text-white' 
//                     : 'bg-gray-200 hover:bg-gray-300'
//                 } ${submitting || submittedAnswers[q._id] ? 'cursor-not-allowed opacity-50' : ''}`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//           {submittedAnswers[q._id] && (
//             <p className="text-green-600 mt-2">✓ Answer submitted</p>
//           )}
//         </div>
//       ))}

//       {attemptedCount === totalQuestions && (
//         <div className="mt-4 p-4 bg-green-100 rounded">
//           <p className="text-green-700 font-bold">✓ All questions attempted! Wait for qualification results.</p>
//           <button 
//             onClick={() => navigate("/dashboard")}
//             className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import gsap from "gsap";

import { Howl } from "howler";

import {
  FaClock,
  FaCheck,
  FaTimes,
  FaKey,
  FaArrowRight,
} from "react-icons/fa";

import { getQuestions } from "../services/questionService";

import { submitMCQ } from "../services/submissionService";

import { getProfile } from "../services/authService";

/* ---------------- AUDIO ---------------- */

const hoverSound = new Howl({
  src: ["/sounds/hover.mp3"],
  volume: 0.25,
});

const clickSound = new Howl({
  src: ["/sounds/click.mp3"],
  volume: 0.4,
});

const correctSound = new Howl({
  src: ["/sounds/correct.mp3"],
  volume: 0.5,
});

const wrongSound = new Howl({
  src: ["/sounds/wrong.mp3"],
  volume: 0.5,
});

const suspenseSound = new Howl({
  src: ["/sounds/suspense.mp3"],
  volume: 0.35,
  loop: true,
});

/* ---------------- MAIN ---------------- */

export default function Phase1() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [submittedAnswers, setSubmittedAnswers] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const [currentScore, setCurrentScore] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [unlockMessage, setUnlockMessage] = useState("");

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    suspenseSound.play();

    getQuestions(1, "MCQ")
      .then((res) => {
        setQuestions(res.data.data.questions);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load questions"
        );

        setLoading(false);
      });

    getProfile()
      .then((res) => {
        setCurrentScore(res.data.data.phase1Score || 0);
      })
      .catch(console.error);

    return () => {
      suspenseSound.stop();
    };
  }, []);

  /* ---------------- ANIMATIONS ---------------- */

  useEffect(() => {
    gsap.fromTo(
      ".question-card",
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }
    );
  }, [currentQuestion]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (qId, answer) => {
    clickSound.play();

    setSubmitting(true);

    try {
      const res = await submitMCQ({
        questionId: qId,
        answer,
      });

      setSubmittedAnswers((prev) => ({
        ...prev,
        [qId]: answer,
      }));

      if (res.data.data?.score !== undefined) {
        setCurrentScore(res.data.data.score);
      }

      correctSound.play();

      gsap.fromTo(
        ".question-card",
        {
          scale: 1,
        },
        {
          scale: 1.02,
          duration: 0.2,
          repeat: 1,
          yoyo: true,
        }
      );

      /* PASSWORD REVEAL */

      if (
        res.data.data?.phaseCompletion?.qualification
          ?.phasePassword
      ) {
        const password =
          res.data.data.phaseCompletion.qualification
            .phasePassword;

        setUnlockMessage(password);

        suspenseSound.stop();

        setTimeout(() => {
          alert(
            `🔓 ACCESS GRANTED\n\nPhase 2 Password: ${password}`
          );
        }, 1200);
      } else {
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          }
        }, 700);
      }
    } catch (error) {
      console.error(error);

      wrongSound.play();

      gsap.fromTo(
        ".question-card",
        {
          x: -10,
        },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
        }
      );

      alert(
        error.response?.data?.message ||
          "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-cyan-400 text-3xl">
        Loading Investigation Files...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-red-500 text-2xl">
        {error}
      </div>
    );
  }

  const question = questions[currentQuestion];

  const attemptedCount =
    Object.keys(submittedAnswers).length;

  const totalQuestions = questions.length;

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden cyber-grid">
      {/* GLOW */}
      <div className="absolute top-10 left-20 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px]" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">
            Paper Investigation
          </h1>

          <p className="text-gray-400 mt-2">
            Solve every clue to unlock the next room
          </p>
        </div>

        <div className="glass-panel px-5 py-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <FaClock className="text-cyan-400" />

            <div>
              <p className="text-sm text-gray-400">
                Progress
              </p>

              <p className="font-bold">
                {attemptedCount}/{totalQuestions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SCORE */}
      <div className="relative z-10 px-8 mt-6">
        <div className="glass-panel rounded-2xl p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">
              Current Score
            </p>

            <h2 className="text-4xl font-bold text-cyan-400">
              {currentScore}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-sm">
              Question
            </p>

            <h2 className="text-2xl font-bold">
              {currentQuestion + 1}
            </h2>
          </div>
        </div>
      </div>

      {/* QUESTION */}
      <div className="relative z-10 flex justify-center px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question._id}
            initial={{
              opacity: 0,
              x: 100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -100,
            }}
            transition={{
              duration: 0.4,
            }}
            className="question-card glass-panel rounded-[30px] w-full max-w-4xl p-10 border border-white/10"
          >
            {/* TITLE */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold leading-relaxed">
                  {question.title}
                </h2>

                <div className="mt-4 flex gap-4 text-sm text-gray-400">
                  <span>
                    Marks: {question.marks}
                  </span>

                  <span>
                    Negative:{" "}
                    {question.negativeMarks || 0}
                  </span>
                </div>
              </div>

              <div className="text-cyan-400 text-5xl">
                ?
              </div>
            </div>

            {/* OPTIONS */}
            <div className="grid md:grid-cols-2 gap-5">
              {question.options.map((opt, idx) => {
                const selected =
                  submittedAnswers[question._id] === opt;

                return (
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    key={idx}
                    onMouseEnter={() =>
                      hoverSound.play()
                    }
                    onClick={() =>
                      handleSubmit(question._id, opt)
                    }
                    disabled={
                      submitting ||
                      submittedAnswers[question._id]
                    }
                    className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 text-left
                    
                    ${
                      selected
                        ? "bg-green-500/20 border-green-400 text-green-300"
                        : "bg-black/30 border-white/10 hover:border-cyan-400"
                    }
                    
                    ${
                      submitting
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">
                        {opt}
                      </span>

                      {selected && (
                        <FaCheck className="text-green-400" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* NEXT */}
            {submittedAnswers[question._id] &&
              currentQuestion <
                questions.length - 1 && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() =>
                      setCurrentQuestion(
                        currentQuestion + 1
                      )
                    }
                    className="bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl font-bold flex items-center gap-3"
                  >
                    Next Question
                    <FaArrowRight />
                  </button>
                </div>
              )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PHASE COMPLETE */}
      {attemptedCount === totalQuestions && (
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative z-10 px-8 pb-10"
        >
          <div className="glass-panel rounded-3xl p-8 border border-green-500/30">
            <div className="flex items-center gap-4 mb-4">
              <FaKey className="text-green-400 text-4xl" />

              <div>
                <h2 className="text-3xl font-bold text-green-400">
                  Investigation Complete
                </h2>

                <p className="text-gray-400 mt-1">
                  Awaiting qualification results...
                </p>
              </div>
            </div>

            {unlockMessage && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6"
              >
                <p className="text-cyan-300 text-lg">
                  🔓 Phase 2 Access Key:
                </p>

                <h3 className="text-4xl font-bold text-cyan-400 mt-3 tracking-widest">
                  {unlockMessage}
                </h3>
              </motion.div>
            )}

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mt-8 bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl font-bold"
            >
              Return Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}