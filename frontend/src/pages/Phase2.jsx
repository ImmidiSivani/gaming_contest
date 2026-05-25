// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { getQuestions } from "../services/questionService";
// import { submitDebug, runDebug } from "../services/submissionService";
// import { getProfile } from "../services/authService";

// export default function Phase2() {
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [code, setCode] = useState("");
//   const [languageId, setLanguageId] = useState(63);
//   const [hintsUsed, setHintsUsed] = useState(0);
//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [running, setRunning] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [currentScore, setCurrentScore] = useState(0);
//   const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());

//   useEffect(() => {
//     getQuestions(2, 'DEBUG')
//       .then((res) => {
//         setQuestions(res.data.data.questions);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Phase2 error:', err);
//         setError(err.response?.data?.message || 'Failed to load questions');
//         setLoading(false);
//       });
    
//     getProfile()
//       .then((res) => {
//         setCurrentScore(res.data.data.phase2Score || 0);
//       })
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!questions.length) return;
//     const q = questions[current];
//     setCode(q.starterCode || q.code || "");
//     setLanguageId(q.languageId || 63);
//     setRunResult(null);
//     setSubmitResult(null);
//     setHintsUsed(0);
//   }, [questions, current]);

//   if (loading) return <div>Loading questions...</div>;
//   if (error) return <div className="text-red-500">Error: {error}</div>;
//   if (!questions.length) return <div>No questions available</div>;

//   const q = questions[current];
//   const sampleTestCases = q.testCases?.filter((tc) => !tc.isHidden) || [];

//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       alert('Please write some code before submitting.');
//       return;
//     }

//     setSubmitting(true);
//     setSubmitResult(null);

//     try {
//       const res = await submitDebug({
//         questionId: q._id,
//         code,
//         languageId,
//         hintsUsed,
//       });

//       setSubmitResult(res.data.data);
//       setAttemptedQuestions((prev) => new Set([...prev, q._id]));
//       setCurrentScore((prev) => prev + (res.data.data.score || 0));

//       if (res.data.data?.phaseCompletion?.qualification?.phasePassword) {
//         alert(`🎉 Congratulations! You've qualified for Phase 3!\nPassword: ${res.data.data.phaseCompletion.qualification.phasePassword}`);
//       }

//       if (current < questions.length - 1) {
//         setTimeout(() => {
//           setCurrent(current + 1);
//         }, 2000);
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || 'Submission failed.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRun = async () => {
//     if (!code.trim()) {
//       alert('Please write some code before running.');
//       return;
//     }

//     setRunning(true);
//     setRunResult(null);

//     try {
//       const res = await runDebug({
//         questionId: q._id,
//         code,
//         languageId,
//       });
//       setRunResult(res.data.data);
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || 'Run failed.');
//     } finally {
//       setRunning(false);
//     }
//   };

//   const useHint = () => {
//     if (q.hints && q.hints.length > hintsUsed) {
//       setHintsUsed(hintsUsed + 1);
//     }
//   };

//   const attemptedCount = attemptedQuestions.size;
//   const totalQuestions = questions.length;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2>Phase 2 - Debugging</h2>
//         <div className="text-right">
//           <p>Score: <strong>{currentScore}</strong></p>
//           <p className="text-sm text-gray-600">Progress: {attemptedCount}/{totalQuestions} attempted</p>
//         </div>
//       </div>
      
//       <p className="text-yellow-600 bg-yellow-50 p-2 rounded mb-4">
//         ℹ️ You must attempt ALL {totalQuestions} questions to complete this phase and qualify for Phase 3.
//       </p>

//       <div className="mb-4">
//         <h3 className="text-xl font-bold">{q.title}</h3>
//         <p className="mt-2">{q.description}</p>
//       </div>

//       <div className="mb-4">
//         {q.hints?.slice(0, hintsUsed).map((h, i) => (
//           <div key={i} className="text-yellow-600 bg-yellow-50 p-2 rounded mb-2">
//             💡 Hint {i + 1}: {h}
//           </div>
//         ))}
//       </div>

//       <button 
//         onClick={useHint} 
//         disabled={hintsUsed >= (q.hints?.length || 0)}
//         className="bg-yellow-300 px-4 py-2 rounded disabled:opacity-50 mb-4"
//       >
//         {hintsUsed >= (q.hints?.length || 0) ? 'No more hints' : `Use Hint (${hintsUsed}/${q.hints?.length || 0})`}
//       </button>

//       <div className="mb-4">
//         <label className="font-bold mr-2">Language:</label>
//         <select
//           value={languageId}
//           onChange={(e) => setLanguageId(Number(e.target.value))}
//           className="border p-2 rounded"
//         >
//           <option value={63}>JavaScript</option>
//           <option value={62}>Java</option>
//           <option value={52}>C</option>
//           <option value={54}>C++</option>
//           <option value={4}>PHP</option>
//           <option value={10}>Ruby</option>
//           <option value={71}>Python</option>
//           <option value={43}>Plain Text</option>
//         </select>
//       </div>

//       <Editor
//         height="420px"
//         language={
//           languageId === 63 ? 'javascript' :
//           languageId === 62 ? 'java' :
//           languageId === 52 ? 'c' :
//           languageId === 54 ? 'cpp' :
//           languageId === 4 ? 'php' :
//           languageId === 10 ? 'ruby' :
//           languageId === 71 ? 'python' :
//           'plaintext'
//         }
//         value={code}
//         onChange={(value) => setCode(value || "")}
//         options={{
//           minimap: { enabled: false },
//           fontSize: 14,
//           automaticLayout: true,
//         }}
//       />

//       <div className="mt-4 flex flex-wrap gap-3">
//         <button
//           onClick={handleRun}
//           disabled={running}
//           className="bg-blue-500 text-white px-5 py-2 rounded disabled:bg-blue-300"
//         >
//           {running ? 'Running...' : 'Run'}
//         </button>
//         <button
//           onClick={handleSubmit}
//           disabled={submitting}
//           className="bg-green-500 text-white px-5 py-2 rounded disabled:bg-green-300"
//         >
//           {submitting ? 'Submitting...' : 'Submit'}
//         </button>
//       </div>

//       {sampleTestCases.length > 0 && (
//         <div className="mt-4 p-4 bg-gray-50 rounded">
//           <h4 className="font-bold mb-2">Sample Test Cases</h4>
//           {sampleTestCases.map((tc, index) => (
//             <div key={index} className="mb-3">
//               <div className="font-semibold">Input #{index + 1}</div>
//               <pre className="bg-white p-2 rounded mt-1">{tc.input}</pre>
//             </div>
//           ))}
//         </div>
//       )}

//       {runResult && (
//         <div className="mt-4 p-4 rounded bg-blue-50 border border-blue-200">
//           <h4 className="font-bold mb-2">Run Results</h4>
//           <p>Passed: {runResult.passedCount}/{runResult.totalCount}</p>
//           {runResult.results?.map((item, idx) => (
//             <div key={idx} className="mt-3 p-3 bg-white rounded border">
//               <div className="font-semibold">Test #{idx + 1}: {item.passed ? '✅ Passed' : '❌ Failed'}</div>
//               <div className="mt-1">Status: {item.statusDescription}</div>
//               {item.actualOutput !== undefined && (
//                 <div className="mt-1">
//                   <strong>Output:</strong>
//                   <pre className="bg-gray-100 p-2 rounded mt-1">{item.actualOutput || '(empty)'}</pre>
//                 </div>
//               )}
//               {item.stderr && (
//                 <div className="mt-1 text-red-600">
//                   <strong>Error:</strong>
//                   <pre className="bg-gray-100 p-2 rounded mt-1">{item.stderr}</pre>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {submitResult && (
//         <div className="mt-4 p-4 rounded bg-green-50 border border-green-200">
//           <h4 className="font-bold mb-2">Submission Result</h4>
//           <p>Status: {submitResult.status}</p>
//           <p>Score: {submitResult.score}</p>
//           <p>Passed: {submitResult.passedCount}/{submitResult.totalCount}</p>
//           {submitResult.penalty > 0 && <p className="text-red-600">Penalty: -{submitResult.penalty}</p>}
//         </div>
//       )}

//       <div className="flex justify-between mt-4">
//         <button
//           onClick={() => {
//             setCurrent(Math.max(0, current - 1));
//             setSubmitResult(null);
//             setRunResult(null);
//           }}
//           disabled={current === 0}
//           className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <button
//           onClick={() => {
//             setCurrent(Math.min(questions.length - 1, current + 1));
//             setSubmitResult(null);
//             setRunResult(null);
//           }}
//           disabled={current === questions.length - 1}
//           className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

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

import Editor from "@monaco-editor/react";

import { motion, AnimatePresence } from "framer-motion";

import gsap from "gsap";

import { Howl } from "howler";

import {
  FaBug,
  FaPlay,
  FaPaperPlane,
  FaLightbulb,
  FaTerminal,
  FaChevronLeft,
  FaChevronRight,
  FaKey,
} from "react-icons/fa";

import { getQuestions } from "../services/questionService";

import {
  submitDebug,
  runDebug,
} from "../services/submissionService";

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

const successSound = new Howl({
  src: ["/sounds/correct.mp3"],
  volume: 0.5,
});

const errorSound = new Howl({
  src: ["/sounds/wrong.mp3"],
  volume: 0.5,
});

const terminalAmbient = new Howl({
  src: ["/sounds/terminal.mp3"],
  volume: 0.2,
  loop: true,
});

/* ---------------- MAIN ---------------- */

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

  const [attemptedQuestions, setAttemptedQuestions] =
    useState(new Set());

  const [unlockPassword, setUnlockPassword] =
    useState("");

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    terminalAmbient.play();

    getQuestions(2, "DEBUG")
      .then((res) => {
        setQuestions(res.data.data.questions);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Phase2 error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load questions"
        );

        setLoading(false);
      });

    getProfile()
      .then((res) => {
        setCurrentScore(
          res.data.data.phase2Score || 0
        );
      })
      .catch(console.error);

    return () => {
      terminalAmbient.stop();
    };
  }, []);

  /* ---------------- LOAD QUESTION ---------------- */

  useEffect(() => {
    if (!questions.length) return;

    const q = questions[current];

    setCode(q.starterCode || q.code || "");

    setLanguageId(q.languageId || 63);

    setRunResult(null);

    setSubmitResult(null);

    setHintsUsed(0);

    gsap.fromTo(
      ".tablet-panel",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }
    );
  }, [questions, current]);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-cyan-400 text-3xl">
        Initializing Debugging Tablet...
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
        No questions available
      </div>
    );
  }

  const q = questions[current];

  const sampleTestCases =
    q.testCases?.filter((tc) => !tc.isHidden) || [];

  /* ---------------- RUN ---------------- */

  const handleRun = async () => {
    if (!code.trim()) {
      alert("Please write some code before running.");
      return;
    }

    clickSound.play();

    setRunning(true);

    setRunResult(null);

    try {
      const res = await runDebug({
        questionId: q._id,
        code,
        languageId,
      });

      successSound.play();

      setRunResult(res.data.data);

      gsap.fromTo(
        ".terminal-box",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
        }
      );
    } catch (error) {
      console.error(error);

      errorSound.play();

      alert(
        error.response?.data?.message ||
          "Run failed."
      );
    } finally {
      setRunning(false);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert(
        "Please write some code before submitting."
      );
      return;
    }

    clickSound.play();

    setSubmitting(true);

    setSubmitResult(null);

    try {
      const res = await submitDebug({
        questionId: q._id,
        code,
        languageId,
        hintsUsed,
      });

      successSound.play();

      setSubmitResult(res.data.data);

      setAttemptedQuestions(
        (prev) => new Set([...prev, q._id])
      );

      setCurrentScore(
        (prev) =>
          prev + (res.data.data.score || 0)
      );

      /* PASSWORD REVEAL */

      if (
        res.data.data?.phaseCompletion
          ?.qualification?.phasePassword
      ) {
        const password =
          res.data.data.phaseCompletion
            .qualification.phasePassword;

        setUnlockPassword(password);

        setTimeout(() => {
          alert(
            `🔓 PHASE 3 UNLOCKED\n\nPassword: ${password}`
          );
        }, 1000);
      }

      if (current < questions.length - 1) {
        setTimeout(() => {
          setCurrent(current + 1);
        }, 1800);
      }
    } catch (error) {
      console.error(error);

      errorSound.play();

      gsap.fromTo(
        ".tablet-panel",
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
          "Submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- HINTS ---------------- */

  const useHint = () => {
    hoverSound.play();

    if (
      q.hints &&
      q.hints.length > hintsUsed
    ) {
      setHintsUsed(hintsUsed + 1);
    }
  };

  const attemptedCount =
    attemptedQuestions.size;

  const totalQuestions =
    questions.length;

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden cyber-grid relative">
      {/* BACKGROUND */}
      <div className="absolute top-10 right-20 w-[500px] h-[500px] bg-purple-500/10 blur-[120px]" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-bold text-purple-400 flex items-center gap-4">
            <FaBug />
            Debugging Tablet
          </h1>

          <p className="text-gray-400 mt-2">
            Repair corrupted systems to proceed
          </p>
        </div>

        <div className="glass-panel px-5 py-3 rounded-2xl">
          <p className="text-gray-400 text-sm">
            Score
          </p>

          <h2 className="text-3xl font-bold text-purple-400">
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
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="tablet-panel glass-panel rounded-[30px] border border-white/10 overflow-hidden"
        >
          {/* TOP BAR */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/20">
            <div>
              <h2 className="text-2xl font-bold">
                {q.title}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Question {current + 1} /{" "}
                {questions.length}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onMouseEnter={() =>
                  hoverSound.play()
                }
                onClick={useHint}
                disabled={
                  hintsUsed >=
                  (q.hints?.length || 0)
                }
                className="bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 transition px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-40"
              >
                <FaLightbulb />

                {hintsUsed}/
                {q.hints?.length || 0}
              </button>

              <select
                value={languageId}
                onChange={(e) =>
                  setLanguageId(
                    Number(e.target.value)
                  )
                }
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 outline-none"
              >
                <option value={63}>
                  JavaScript
                </option>

                <option value={62}>
                  Java
                </option>

                <option value={52}>
                  C
                </option>

                <option value={54}>
                  C++
                </option>

                <option value={71}>
                  Python
                </option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="p-6 border-b border-white/10">
            <p className="text-gray-300 leading-relaxed">
              {q.description}
            </p>

            {/* HINTS */}
            <div className="mt-5 space-y-3">
              {q.hints
                ?.slice(0, hintsUsed)
                .map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-300"
                  >
                    💡 {h}
                  </motion.div>
                ))}
            </div>
          </div>

          {/* EDITOR */}
          <Editor
            height="500px"
            theme="vs-dark"
            language={
              languageId === 63
                ? "javascript"
                : languageId === 62
                ? "java"
                : languageId === 52
                ? "c"
                : languageId === 54
                ? "cpp"
                : languageId === 71
                ? "python"
                : "plaintext"
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
          <div className="p-6 flex flex-wrap gap-4 border-t border-white/10">
            <button
              onClick={handleRun}
              disabled={running}
              className="bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl font-bold flex items-center gap-3 disabled:opacity-50"
            >
              <FaPlay />

              {running
                ? "Executing..."
                : "Run Code"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-500 hover:bg-green-400 transition px-6 py-3 rounded-xl font-bold flex items-center gap-3 disabled:opacity-50"
            >
              <FaPaperPlane />

              {submitting
                ? "Submitting..."
                : "Submit"}
            </button>
          </div>
        </motion.div>

        {/* TERMINAL */}
        <AnimatePresence>
          {(runResult || submitResult) && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="terminal-box mt-8 glass-panel rounded-3xl p-6 border border-cyan-500/20"
            >
              <div className="flex items-center gap-3 mb-5 text-cyan-400">
                <FaTerminal />

                <h3 className="text-xl font-bold">
                  Terminal Output
                </h3>
              </div>

              {/* RUN RESULT */}
              {runResult && (
                <div className="mb-6">
                  <p className="text-cyan-300 font-semibold">
                    Passed:
                    {" "}
                    {runResult.passedCount}/
                    {runResult.totalCount}
                  </p>
                </div>
              )}

              {/* SUBMIT RESULT */}
              {submitResult && (
                <div>
                  <p className="text-green-400 font-bold text-lg">
                    {submitResult.status}
                  </p>

                  <p className="mt-2">
                    Score:
                    {" "}
                    {submitResult.score}
                  </p>

                  <p>
                    Passed:
                    {" "}
                    {submitResult.passedCount}/
                    {submitResult.totalCount}
                  </p>

                  {submitResult.penalty >
                    0 && (
                    <p className="text-red-400">
                      Penalty:
                      {" "}
                      -
                      {
                        submitResult.penalty
                      }
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* TEST CASES */}
        {sampleTestCases.length > 0 && (
          <div className="mt-8 glass-panel rounded-3xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-5">
              Sample Test Cases
            </h3>

            <div className="space-y-4">
              {sampleTestCases.map(
                (tc, index) => (
                  <div
                    key={index}
                    className="bg-black/30 rounded-2xl p-4 border border-white/5"
                  >
                    <p className="text-cyan-400 font-semibold mb-2">
                      Input #{index + 1}
                    </p>

                    <pre className="text-gray-300 whitespace-pre-wrap">
                      {tc.input}
                    </pre>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              setCurrent(
                Math.max(0, current - 1)
              );

              setSubmitResult(null);

              setRunResult(null);
            }}
            disabled={current === 0}
            className="bg-white/10 hover:bg-white/20 transition px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-40"
          >
            <FaChevronLeft />
            Previous
          </button>

          <button
            onClick={() => {
              setCurrent(
                Math.min(
                  questions.length - 1,
                  current + 1
                )
              );

              setSubmitResult(null);

              setRunResult(null);
            }}
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
            className="mt-10 glass-panel rounded-3xl p-8 border border-green-500/30"
          >
            <div className="flex items-center gap-4">
              <FaKey className="text-green-400 text-4xl" />

              <div>
                <h2 className="text-3xl font-bold text-green-400">
                  Debugging Complete
                </h2>

                <p className="text-gray-400 mt-2">
                  Awaiting qualification
                  results...
                </p>
              </div>
            </div>

            {unlockPassword && (
              <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
                <p className="text-cyan-300">
                  🔓 Phase 3 Password
                </p>

                <h3 className="text-4xl font-bold text-cyan-400 mt-3 tracking-widest">
                  {unlockPassword}
                </h3>
              </div>
            )}

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mt-8 bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl font-bold"
            >
              Return Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}