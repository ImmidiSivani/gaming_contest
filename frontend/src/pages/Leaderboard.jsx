// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useSocket from "../hooks/useSocket";
// import { getLeaderboard } from "../services/leaderboardService";

// export default function Leaderboard() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const socket = useSocket();
//   const navigate = useNavigate();

//   useEffect(() => {
//     getLeaderboard()
//       .then((res) => {
//         setData(res.data.data.leaderboard);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError(err.response?.data?.message || 'Failed to load leaderboard');
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("leaderboardUpdate", (update) => {
//       setData(update.leaderboard);
//     });

//     return () => {
//       socket.off("leaderboardUpdate");
//     };
//   }, [socket]);

//   if (loading) return <div className="p-4">Loading leaderboard...</div>;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Leaderboard</h1>
//         <button 
//           onClick={() => navigate("/dashboard")}
//           className="bg-gray-500 text-white px-4 py-2 rounded"
//         >
//           Back to Dashboard
//         </button>
//       </div>

//       {data.length === 0 ? (
//         <p>No participants yet</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2">Rank</th>
//                 <th className="border p-2">Name</th>
//                 <th className="border p-2">Phase</th>
//                 <th className="border p-2">Total Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((u) => (
//                 <tr key={u.id} className="text-center">
//                   <td className="border p-2">
//                     {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
//                   </td>
//                   <td className="border p-2 font-medium">{u.name}</td>
//                   <td className="border p-2">{u.currentPhase}</td>
//                   <td className="border p-2 font-bold">{u.totalScore}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import gsap from "gsap";

import { Howl } from "howler";

import {
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaSkull,
} from "react-icons/fa";

import useSocket from "../hooks/useSocket";

import { getLeaderboard } from "../services/leaderboardService";

/* ---------------- AUDIO ---------------- */

const alertSound = new Howl({
  src: ["/sounds/alert.mp3"],
  volume: 0.4,
});

const riseSound = new Howl({
  src: ["/sounds/rankup.mp3"],
  volume: 0.5,
});

/* ---------------- MAIN ---------------- */

export default function Leaderboard() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [alertMessage, setAlertMessage] = useState("");

  const previousRanks = useRef({});

  const socket = useSocket();

  const navigate = useNavigate();

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    getLeaderboard()
      .then((res) => {
        setData(res.data.data.leaderboard);

        const initialRanks = {};

        res.data.data.leaderboard.forEach((u) => {
          initialRanks[u.id] = u.rank;
        });

        previousRanks.current = initialRanks;

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load leaderboard"
        );

        setLoading(false);
      });
  }, []);

  /* ---------------- SOCKET UPDATES ---------------- */

  useEffect(() => {
    if (!socket) return;

    socket.on("leaderboardUpdate", (update) => {
      const newBoard = update.leaderboard;

      newBoard.forEach((user) => {
        const prevRank = previousRanks.current[user.id];

        if (prevRank && user.rank < prevRank) {
          riseSound.play();

          setAlertMessage(
            `${user.name} is climbing the leaderboard 🚀`
          );

          gsap.fromTo(
            `.player-${user.id}`,
            {
              scale: 1,
            },
            {
              scale: 1.06,
              duration: 0.4,
              repeat: 1,
              yoyo: true,
            }
          );
        }

        previousRanks.current[user.id] = user.rank;
      });

      alertSound.play();

      setData(newBoard);

      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    });

    return () => {
      socket.off("leaderboardUpdate");
    };
  }, [socket]);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    gsap.fromTo(
      ".leaderboard-card",
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
      }
    );
  }, [data]);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-cyan-400 text-3xl">
        Syncing Leaderboard...
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

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative cyber-grid">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[140px]" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/10">
        <div>
          <h1 className="text-5xl font-bold text-cyan-400 flex items-center gap-4">
            <FaTrophy />
            Live Leaderboard
          </h1>

          <p className="text-gray-400 mt-2">
            Real-time escape room rankings
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="glass-panel px-5 py-3 rounded-xl hover:scale-105 transition-all"
        >
          Return Dashboard
        </button>
      </div>

      {/* LIVE ALERT */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{
              opacity: 0,
              y: -40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -40,
            }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-cyan-500 text-black px-6 py-3 rounded-2xl font-bold shadow-2xl"
          >
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE */}
      <div className="relative z-10 p-8">
        {data.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center text-gray-400">
            No contestants detected
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((u, index) => {
              const isTop3 = u.rank <= 3;

              return (
                <motion.div
                  key={u.id}
                  layout
                  className={`player-${u.id} leaderboard-card glass-panel rounded-3xl p-6 border transition-all duration-300
                  
                  ${
                    isTop3
                      ? "border-yellow-500/40 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                      : "border-white/10"
                  }
                  `}
                >
                  <div className="flex items-center justify-between">
                    {/* LEFT */}
                    <div className="flex items-center gap-6">
                      {/* RANK */}
                      <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center text-2xl font-bold">
                        {u.rank === 1 ? (
                          "🥇"
                        ) : u.rank === 2 ? (
                          "🥈"
                        ) : u.rank === 3 ? (
                          "🥉"
                        ) : (
                          u.rank
                        )}
                      </div>

                      {/* INFO */}
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                          {u.name}

                          {u.rank <= 3 && (
                            <FaTrophy className="text-yellow-400" />
                          )}
                        </h2>

                        <div className="flex gap-5 mt-2 text-gray-400 text-sm">
                          <span>
                            Phase: {u.currentPhase}
                          </span>

                          <span>
                            Score: {u.totalScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">
                      {index === 0 ? (
                        <div className="text-green-400 flex items-center gap-2 font-semibold">
                          <FaArrowUp />
                          Leading
                        </div>
                      ) : index <= 2 ? (
                        <div className="text-cyan-400 flex items-center gap-2">
                          <FaArrowUp />
                          Climbing
                        </div>
                      ) : (
                        <div className="text-gray-500 flex items-center gap-2">
                          <FaSkull />
                          Survive
                        </div>
                      )}

                      <div className="text-4xl font-bold text-cyan-400">
                        {u.totalScore}
                      </div>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mt-5 w-full h-3 rounded-full bg-black/40 overflow-hidden">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${Math.min(
                          (u.totalScore / 1000) * 100,
                          100
                        )}%`,
                      }}
                      transition={{
                        duration: 1,
                      }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}