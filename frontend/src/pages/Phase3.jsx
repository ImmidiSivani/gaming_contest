// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { getQuestions } from "../services/questionService";
// import { submitCode } from "../services/submissionService";
// import { getProfile } from "../services/authService";

// const LANGUAGE_OPTIONS = [
//   { id: 63, name: "JavaScript" },
//   { id: 62, name: "Java" },
//   { id: 52, name: "C" },
//   { id: 54, name: "C++" },
//   { id: 4, name: "PHP" },
//   { id: 10, name: "Ruby" },
//   { id: 71, name: "Python" },
//   { id: 43, name: "Plain Text" },
// ];

// const LANGUAGE_MAP = {
//   JavaScript: "javascript",
//   Java: "java",
//   C: "c",
//   "C++": "cpp",
//   PHP: "php",
//   Ruby: "ruby",
//   Python: "python",
//   "Plain Text": "plaintext",
// };

// export default function Phase3() {
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [code, setCode] = useState("");
//   const [languageId, setLanguageId] = useState(63);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [result, setResult] = useState(null);
//   const [currentScore, setCurrentScore] = useState(0);
//   const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());

//   useEffect(() => {
//     getQuestions(3, 'CODING')
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
//         setCurrentScore(res.data.data.phase3Score || 0);
//       })
//       .catch(console.error);
//   }, []);

//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       alert('Please write some code');
//       return;
//     }

//     setSubmitting(true);
//     setResult(null);

//     try {
//       const res = await submitCode({
//         questionId: questions[current]._id,
//         code,
//         languageId,
//       });
      
//       setResult(res.data.data);
      
//       // Track attempted question
//       setAttemptedQuestions(prev => new Set([...prev, questions[current]._id]));
      
//       // Update score
//       setCurrentScore(prev => prev + (res.data.data.score || 0));
      
//       alert(res.data.message || 'Code submitted successfully!');
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || 'Submission failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleNextQuestion = () => {
//     if (current < questions.length - 1) {
//       setCurrent(current + 1);
//       setCode("");
//       setResult(null);
//     }
//   };

//   const handlePrevQuestion = () => {
//     if (current > 0) {
//       setCurrent(current - 1);
//       setCode("");
//       setResult(null);
//     }
//   };

//   if (loading) return <div>Loading questions...</div>;
//   if (error) return <div className="text-red-500">Error: {error}</div>;
//   if (!questions.length) return <div>No coding questions available</div>;

//   const q = questions[current];
//   const attemptedCount = attemptedQuestions.size;
//   const totalQuestions = questions.length;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2>Phase 3 - Coding</h2>
//         <div className="text-right">
//           <p>Score: <strong>{currentScore}</strong></p>
//           <p className="text-sm text-gray-600">Progress: {attemptedCount}/{totalQuestions} attempted</p>
//         </div>
//       </div>

//       {/* Question Info */}
//       <div className="mb-4 p-4 bg-gray-50 rounded">
//         <h3 className="text-xl font-bold">{q.title}</h3>
//         <p className="mt-2">{q.description}</p>
        
//         {q.inputFormat && (
//           <div className="mt-2">
//             <strong>Input Format:</strong>
//             <pre className="bg-gray-100 p-2 rounded mt-1">{q.inputFormat}</pre>
//           </div>
//         )}
        
//         {q.outputFormat && (
//           <div className="mt-2">
//             <strong>Output Format:</strong>
//             <pre className="bg-gray-100 p-2 rounded mt-1">{q.outputFormat}</pre>
//           </div>
//         )}
        
//         {q.sampleInput && q.sampleOutput && (
//           <div className="mt-2 grid grid-cols-2 gap-4">
//             <div>
//               <strong>Sample Input:</strong>
//               <pre className="bg-gray-100 p-2 rounded mt-1">{q.sampleInput}</pre>
//             </div>
//             <div>
//               <strong>Sample Output:</strong>
//               <pre className="bg-gray-100 p-2 rounded mt-1">{q.sampleOutput}</pre>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Language Selector */}
//       <div className="mb-4">
//         <label className="mr-2 font-bold">Language:</label>
//         <select
//           value={languageId}
//           onChange={(e) => setLanguageId(Number(e.target.value))}
//           className="border p-2 rounded"
//         >
//           {LANGUAGE_OPTIONS.map((lang) => (
//             <option key={lang.id} value={lang.id}>
//               {lang.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Code Editor */}
//       <Editor
//         height="400px"
//         language={LANGUAGE_MAP[LANGUAGE_OPTIONS.find(l => l.id === languageId)?.name] || "javascript"}
//         value={code}
//         onChange={(value) => setCode(value || "")}
//         options={{
//           minimap: { enabled: false },
//           fontSize: 14,
//         }}
//       />

//       {/* Submit Button */}
//       <div className="mt-4 flex gap-4">
//         <button
//           onClick={handleSubmit}
//           disabled={submitting}
//           className="bg-green-500 text-white px-6 py-2 rounded disabled:bg-green-300"
//         >
//           {submitting ? 'Running...' : 'Submit Code'}
//         </button>

//         <button
//           onClick={handlePrevQuestion}
//           disabled={current === 0}
//           className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
//         >
//           Previous
//         </button>

//         <button
//           onClick={handleNextQuestion}
//           disabled={current === questions.length - 1}
//           className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
//         >
//           Next
//         </button>
//       </div>

//       {/* Result */}
//       {result && (
//         <div className="mt-4 p-4 rounded bg-gray-100">
//           <p className="text-lg font-bold">
//             Status: {result.status || 'Completed'}
//           </p>
//           <p>Score: {result.score}</p>
//           {result.passedCount !== undefined && (
//             <p>Test Cases Passed: {result.passedCount}/{result.totalCount}</p>
//           )}
//           {result.stdout && (
//             <div className="mt-2">
//               <strong>Output:</strong>
//               <pre className="bg-white p-2 rounded mt-1">{result.stdout}</pre>
//             </div>
//           )}
//           {result.stderr && (
//             <div className="mt-2 text-red-500">
//               <strong>Error:</strong>
//               <pre className="bg-white p-2 rounded mt-1">{result.stderr}</pre>
//             </div>
//           )}
//           {result.score !== undefined && (
//             <p className="mt-2">Score: {result.score}/{result.maxScore || 100}</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";

import { motion, AnimatePresence } from "framer-motion";

import gsap from "gsap";

import { Howl } from "howler";

import {
  FaCode,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaTerminal,
  FaTrophy,
} from "react-icons/fa";

import { getQuestions } from "../services/questionService";

import { submitCode } from "../services/submissionService";

import { getProfile } from "../services/authService";

/* ---------------- LANGUAGE CONFIG ---------------- */

const LANGUAGE_OPTIONS = [
  { id: 63, name: "JavaScript" },
  { id: 62, name: "Java" },
  { id: 52, name: "C" },
  { id: 54, name: "C++" },
  { id: 71, name: "Python" },
];

const LANGUAGE_MAP = {
  JavaScript: "javascript",
  Java: "java",
  C: "c",
  "C++": "cpp",
  Python: "python",
};

/* ---------------- AUDIO ---------------- */

const hoverSound = new Howl({
  src: ["/sounds/hover.mp3"],
  volume: 0.25,
});

const clickSound = new Howl({
  src: ["/sounds/click.mp3"],
  volume: 0.4,
});

const successSound = new Howl({
  src: ["/sounds/correct.mp3"],
  volume: 0.5,
});

const errorSound = new Howl({
  src: ["/sounds/wrong.mp3"],
  volume: 0.5,
});

const codingAmbient = new Howl({
  src: ["/sounds/coding-room.mp3"],
  volume: 0.25,
  loop: true,
});

/* ---------------- MAIN ---------------- */

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

  const [currentScore, setCurrentScore] =
    useState(0);

  const [attemptedQuestions, setAttemptedQuestions] =
    useState(new Set());

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    codingAmbient.play();

    getQuestions(3, "CODING")
      .then((res) => {
        setQuestions(
          res.data.data.questions
        );

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
        setCurrentScore(
          res.data.data.phase3Score || 0
        );
      })
      .catch(console.error);

    return () => {
      codingAmbient.stop();
    };
  }, []);

  /* ---------------- ANIMATION ---------------- */

  useEffect(() => {
    gsap.fromTo(
      ".workstation",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
      }
    );
  }, [current]);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-cyan-400 text-3xl">
        Initializing Coding Workstation...
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

  if (!questions.length) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-gray-400">
        No coding questions available
      </div>
    );
  }

  const q = questions[current];

  const attemptedCount =
    attemptedQuestions.size;

  const totalQuestions =
    questions.length;

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please write some code");
      return;
    }

    clickSound.play();

    setSubmitting(true);

    setResult(null);

    try {
      const res = await submitCode({
        questionId: q._id,
        code,
        languageId,
      });

      successSound.play();

      setResult(res.data.data);

      setAttemptedQuestions(
        (prev) =>
          new Set([...prev, q._id])
      );

      setCurrentScore(
        (prev) =>
          prev +
          (res.data.data.score || 0)
      );

      gsap.fromTo(
        ".terminal-panel",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        }
      );
    } catch (error) {
      console.error(error);

      errorSound.play();

      gsap.fromTo(
        ".workstation",
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

  /* ---------------- NAVIGATION ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden cyber-grid relative">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-10 left-20 w-[500px] h-[500px] bg-green-500/10 blur-[120px]" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-bold text-green-400 flex items-center gap-4">
            <FaCode />
            Elite Coding Arena
          </h1>

          <p className="text-gray-400 mt-2">
            Final challenge. Escape the system.
          </p>
        </div>

        <div className="glass-panel px-5 py-3 rounded-2xl">
          <p className="text-gray-400 text-sm">
            Score
          </p>

          <h2 className="text-3xl font-bold text-green-400">
            {currentScore}
          </h2>
        </div>
      </div>

      {/* MAIN */}
      <div className="relative z-10 p-8">
        <motion.div
          key={q._id}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="workstation glass-panel rounded-[30px] border border-white/10 overflow-hidden"
        >
          {/* TOP BAR */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/20">
            <div>
              <h2 className="text-2xl font-bold">
                {q.title}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Problem {current + 1}/
                {questions.length}
              </p>
            </div>

            <select
              value={languageId}
              onChange={(e) =>
                setLanguageId(
                  Number(e.target.value)
                )
              }
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 outline-none"
            >
              {LANGUAGE_OPTIONS.map(
                (lang) => (
                  <option
                    key={lang.id}
                    value={lang.id}
                  >
                    {lang.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="p-6 border-b border-white/10 space-y-5">
            <p className="text-gray-300 leading-relaxed">
              {q.description}
            </p>

            {q.inputFormat && (
              <div>
                <h3 className="text-cyan-400 font-bold mb-2">
                  Input Format
                </h3>

                <pre className="bg-black/30 rounded-xl p-4 whitespace-pre-wrap">
                  {q.inputFormat}
                </pre>
              </div>
            )}

            {q.outputFormat && (
              <div>
                <h3 className="text-cyan-400 font-bold mb-2">
                  Output Format
                </h3>

                <pre className="bg-black/30 rounded-xl p-4 whitespace-pre-wrap">
                  {q.outputFormat}
                </pre>
              </div>
            )}

            {q.sampleInput &&
              q.sampleOutput && (
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-cyan-400 font-bold mb-2">
                      Sample Input
                    </h3>

                    <pre className="bg-black/30 rounded-xl p-4 whitespace-pre-wrap">
                      {q.sampleInput}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-cyan-400 font-bold mb-2">
                      Sample Output
                    </h3>

                    <pre className="bg-black/30 rounded-xl p-4 whitespace-pre-wrap">
                      {q.sampleOutput}
                    </pre>
                  </div>
                </div>
              )}
          </div>

          {/* EDITOR */}
          <Editor
            height="520px"
            theme="vs-dark"
            language={
              LANGUAGE_MAP[
                LANGUAGE_OPTIONS.find(
                  (l) =>
                    l.id === languageId
                )?.name
              ] || "javascript"
            }
            value={code}
            onChange={(value) =>
              setCode(value || "")
            }
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 15,
              automaticLayout: true,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              padding: {
                top: 20,
              },
            }}
          />

          {/* ACTIONS */}
          <div className="p-6 flex gap-4 border-t border-white/10">
            <button
              onMouseEnter={() =>
                hoverSound.play()
              }
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-500 hover:bg-green-400 transition px-6 py-3 rounded-xl font-bold flex items-center gap-3 disabled:opacity-50"
            >
              <FaPlay />

              {submitting
                ? "Executing..."
                : "Submit Code"}
            </button>
          </div>
        </motion.div>

        {/* TERMINAL */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="terminal-panel mt-8 glass-panel rounded-3xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-5 text-green-400">
                <FaTerminal />

                <h3 className="text-xl font-bold">
                  Execution Terminal
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-bold text-green-400">
                  Status:
                  {" "}
                  {result.status ||
                    "Completed"}
                </p>

                <p>
                  Score:
                  {" "}
                  {result.score}
                </p>

                {result.passedCount !==
                  undefined && (
                  <p>
                    Test Cases Passed:
                    {" "}
                    {
                      result.passedCount
                    }
                    /
                    {
                      result.totalCount
                    }
                  </p>
                )}

                {result.stdout && (
                  <div>
                    <h4 className="text-cyan-400 font-bold mb-2">
                      Output
                    </h4>

                    <pre className="bg-black/30 rounded-xl p-4 whitespace-pre-wrap">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {result.stderr && (
                  <div>
                    <h4 className="text-red-400 font-bold mb-2">
                      Error
                    </h4>

                    <pre className="bg-black/30 rounded-xl p-4 whitespace-pre-wrap text-red-300">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {result.score !==
                  undefined && (
                  <div className="mt-5">
                    <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${
                            result.maxScore
                              ? (result.score /
                                  result.maxScore) *
                                100
                              : result.score
                          }%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevQuestion}
            disabled={current === 0}
            className="bg-white/10 hover:bg-white/20 transition px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-40"
          >
            <FaChevronLeft />
            Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={
              current ===
              questions.length - 1
            }
            className="bg-white/10 hover:bg-white/20 transition px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-40"
          >
            Next
            <FaChevronRight />
          </button>
        </div>

        {/* COMPLETE */}
        {attemptedCount ===
          totalQuestions && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-10 glass-panel rounded-3xl p-8 border border-yellow-500/30"
          >
            <div className="flex items-center gap-4">
              <FaTrophy className="text-yellow-400 text-4xl" />

              <div>
                <h2 className="text-3xl font-bold text-yellow-400">
                  Contest Complete
                </h2>

                <p className="text-gray-400 mt-2">
                  You survived the escape
                  room coding challenge.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/leaderboard")
              }
              className="mt-8 bg-yellow-500 hover:bg-yellow-400 transition px-6 py-3 rounded-xl font-bold text-black"
            >
              View Final Leaderboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}