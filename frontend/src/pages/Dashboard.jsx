// import { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { unlockPhase } from "../services/phaseService";
// import { getProfile } from "../services/authService";

// export default function Dashboard() {
//   const { user, setUser, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [unlocking, setUnlocking] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [phase2Password, setPhase2Password] = useState("");
//   const [phase3Password, setPhase3Password] = useState("");

//   useEffect(() => {
//     // Refresh user data to get latest phase/status
//     const fetchUserData = () => {
//       getProfile()
//         .then((res) => {
//           setUser(res.data.data);
//           setLoading(false);
//         })
//         .catch(() => {
//           setLoading(false);
//         });
//     };
    
//     fetchUserData();
    
//     // Refresh every 10 seconds to update scores
//     const interval = setInterval(fetchUserData, 10000);
//     return () => clearInterval(interval);
//   }, [setUser]);

//   const handleUnlockPhase = async (phase, password) => {
//     setUnlocking(true);
//     try {
//       console.log('Unlocking phase:', phase, 'with password:', password);
//       const res = await unlockPhase({ phase, password });
//       console.log('Unlock response:', res.data);
      
//       setUser(res.data.data.user);
//       console.log('Updated user:', res.data.data.user);
      
//       // Show success message
//       alert(`Phase ${phase} unlocked! Redirecting to phase page...`);
      
//       // Clear password after successful unlock
//       if (phase === 2) setPhase2Password("");
//       if (phase === 3) setPhase3Password("");
      
//       // Navigate to the unlocked phase
//       console.log('Navigating to:', `/phase${phase}`);
//       navigate(`/phase${phase}`);
//     } catch (error) {
//       console.error('Unlock error:', error);
//       alert(error.response?.data?.message || 'Failed to unlock phase');
//     } finally {
//       setUnlocking(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     logout();
//     navigate("/");
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!user) return <div>Please login first</div>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
//         <button 
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="bg-gray-100 p-4 rounded mb-6">
//         <p><strong>Current Phase:</strong> {user.currentPhase}</p>
//         <p><strong>Status:</strong> {user.status}</p>
//         <p><strong>Total Score:</strong> {user.totalScore || 0}</p>
//         <p><strong>Phase 1 Score:</strong> {user.phase1Score || 0}</p>
//         <p><strong>Phase 2 Score:</strong> {user.phase2Score || 0}</p>
//         <p><strong>Phase 3 Score:</strong> {user.phase3Score || 0}</p>
        
//         {/* Show generated passwords if qualified */}
//         {user.phasePasswords?.phase2?.password && (
//           <p className="text-green-600 mt-2">
//             🎉 Phase 2 Password: <strong>{user.phasePasswords.phase2.password}</strong>
//             {user.phasePasswords.phase2.used && <span className="text-gray-500 ml-2">(Used)</span>}
//           </p>
//         )}
//         {user.phasePasswords?.phase3?.password && (
//           <p className="text-green-600 mt-2">
//             🎉 Phase 3 Password: <strong>{user.phasePasswords.phase3.password}</strong>
//             {user.phasePasswords.phase3.used && <span className="text-gray-500 ml-2">(Used)</span>}
//           </p>
//         )}
        
//         {user.isQualified === false && (
//           <p className="text-red-500 mt-2">
//             ❌ You have been eliminated. Cannot proceed further.
//           </p>
//         )}
//       </div>

//       <h2 className="text-xl font-bold mb-4">Available Phases</h2>

//       <div className="grid gap-4">
//         {/* Phase 1 */}
//         <div className="border p-4 rounded">
//           <h3 className="font-bold">Phase 1 - MCQ</h3>
//           <p className="text-gray-600">Answer multiple choice questions</p>
//           <button 
//             onClick={() => navigate("/phase1")}
//             className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
//           >
//             Go to Phase 1
//           </button>
//         </div>

//         {/* Phase 2 */}
//         <div className="border p-4 rounded">
//           <h3 className="font-bold">Phase 2 - Debugging</h3>
//           <p className="text-gray-600">Fix bugs in given code</p>
//           {user.currentPhase >= 2 ? (
//             <button 
//               onClick={() => navigate("/phase2")}
//               className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
//             >
//               Go to Phase 2
//             </button>
//           ) : (
//             <div>
//               <input
//                 type="text"
//                 placeholder="Enter Phase 2 password"
//                 value={phase2Password}
//                 onChange={(e) => setPhase2Password(e.target.value)}
//                 className="border p-2 rounded mt-2 w-full"
//                 disabled={unlocking}
//               />
//               <button 
//                 onClick={() => handleUnlockPhase(2, phase2Password)}
//                 disabled={unlocking || !phase2Password || user.currentPhase < 1}
//                 className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded disabled:bg-gray-300"
//               >
//                 {unlocking ? 'Unlocking...' : 'Unlock Phase 2'}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Phase 3 */}
//         <div className="border p-4 rounded">
//           <h3 className="font-bold">Phase 3 - Coding</h3>
//           <p className="text-gray-600">Solve coding problems</p>
//           {user.currentPhase >= 3 ? (
//             <button 
//               onClick={() => navigate("/phase3")}
//               className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
//             >
//               Go to Phase 3
//             </button>
//           ) : (
//             <div>
//               <input
//                 type="text"
//                 placeholder="Enter Phase 3 password"
//                 value={phase3Password}
//                 onChange={(e) => setPhase3Password(e.target.value)}
//                 className="border p-2 rounded mt-2 w-full"
//                 disabled={unlocking}
//               />
//               <button 
//                 onClick={() => handleUnlockPhase(3, phase3Password)}
//                 disabled={unlocking || !phase3Password || user.currentPhase < 2}
//                 className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded disabled:bg-gray-300"
//               >
//                 {unlocking ? 'Unlocking...' : 'Unlock Phase 3'}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="mt-6">
//         <button 
//           onClick={() => navigate("/leaderboard")}
//           className="bg-purple-500 text-white px-4 py-2 rounded"
//         >
//           View Leaderboard
//         </button>
//       </div>
//     </div>
//   );
// }



import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { unlockPhase } from "../services/phaseService";
import { getProfile } from "../services/authService";

import { motion } from "framer-motion";
import gsap from "gsap";
import { Howl } from "howler";

import {
  FaLock,
  FaLockOpen,
  FaTerminal,
  FaLaptopCode,
  FaClipboardCheck,
  FaTrophy,
} from "react-icons/fa";

export default function Dashboard() {
  const { user, setUser, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [unlocking, setUnlocking] = useState(false);
  const [loading, setLoading] = useState(true);

  const [phase2Password, setPhase2Password] = useState("");
  const [phase3Password, setPhase3Password] = useState("");

  const dashboardRef = useRef();

  /* ---------------- AUDIO ---------------- */

  const clickSound = new Howl({
    src: ["/sounds/click.mp3"],
    volume: 0.4,
  });

  const unlockSound = new Howl({
    src: ["/sounds/unlock.mp3"],
    volume: 0.5,
  });

  const errorSound = new Howl({
    src: ["/sounds/error.mp3"],
    volume: 0.4,
  });

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    gsap.fromTo(
      ".phase-card",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }
    );

    gsap.to(".dashboard-glow", {
      opacity: 0.5,
      duration: 2,
      repeat: -1,
      yoyo: true,
    });
  }, []);

  /* ---------------- FETCH USER ---------------- */

  useEffect(() => {
    const fetchUserData = () => {
      getProfile()
        .then((res) => {
          setUser(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };

    fetchUserData();

    const interval = setInterval(fetchUserData, 10000);

    return () => clearInterval(interval);
  }, [setUser]);

  /* ---------------- UNLOCK PHASE ---------------- */

  const handleUnlockPhase = async (phase, password) => {
    clickSound.play();

    setUnlocking(true);

    try {
      const res = await unlockPhase({ phase, password });

      unlockSound.play();

      setUser(res.data.data.user);

      if (phase === 2) setPhase2Password("");
      if (phase === 3) setPhase3Password("");

      gsap.fromTo(
        `.phase-${phase}`,
        { scale: 1 },
        {
          scale: 1.05,
          duration: 0.3,
          repeat: 1,
          yoyo: true,
        }
      );

      setTimeout(() => {
        navigate(`/phase${phase}`);
      }, 1500);
    } catch (error) {
      errorSound.play();

      gsap.fromTo(
        `.phase-${phase}`,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
        }
      );

      alert(error.response?.data?.message || "Failed to unlock phase");
    } finally {
      setUnlocking(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-cyan-400 text-2xl">
        Initializing Escape Room...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400 text-2xl">
        Access Denied
      </div>
    );
  }

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-[#050816] text-white relative overflow-hidden cyber-grid"
    >
      {/* BACKGROUND GLOW */}
      <div className="dashboard-glow absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[140px]" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">
            Escape Control Room
          </h1>

          <p className="text-gray-400 mt-1">
            Welcome back, Agent {user.name}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="glass-panel px-5 py-2 rounded-xl hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      {/* USER STATUS */}
      <div className="relative z-10 p-8 grid md:grid-cols-4 gap-4">
        <StatusCard title="Current Phase" value={user.currentPhase} />
        <StatusCard title="Total Score" value={user.totalScore || 0} />
        <StatusCard title="Phase 1" value={user.phase1Score || 0} />
        <StatusCard title="Phase 2" value={user.phase2Score || 0} />
      </div>

      {/* PASSWORD REVEALS */}
      <div className="px-8 relative z-10">
        {user.phasePasswords?.phase2?.password && (
          <div className="glass-panel p-4 rounded-2xl mb-4 border border-cyan-500/30">
            🔑 Phase 2 Access Key:
            <span className="text-cyan-400 ml-2 font-bold">
              {user.phasePasswords.phase2.password}
            </span>
          </div>
        )}

        {user.phasePasswords?.phase3?.password && (
          <div className="glass-panel p-4 rounded-2xl mb-4 border border-purple-500/30">
            🔑 Phase 3 Access Key:
            <span className="text-purple-400 ml-2 font-bold">
              {user.phasePasswords.phase3.password}
            </span>
          </div>
        )}
      </div>

      {/* PHASES */}
      <div className="relative z-10 p-8 grid lg:grid-cols-3 gap-8">
        {/* PHASE 1 */}
        <PhaseCard
          icon={<FaClipboardCheck />}
          title="Paper & Pen"
          subtitle="MCQ Challenge"
          color="cyan"
          unlocked={true}
          onClick={() => navigate("/phase1")}
        />

        {/* PHASE 2 */}
        <motion.div className="phase-card phase-2">
          <PhaseContainer
            icon={<FaTerminal />}
            title="Tablet System"
            subtitle="Debugging Chamber"
            unlocked={user.currentPhase >= 2}
            password={phase2Password}
            setPassword={setPhase2Password}
            onUnlock={() => handleUnlockPhase(2, phase2Password)}
            onEnter={() => navigate("/phase2")}
            unlocking={unlocking}
            color="purple"
          />
        </motion.div>

        {/* PHASE 3 */}
        <motion.div className="phase-card phase-3">
          <PhaseContainer
            icon={<FaLaptopCode />}
            title="Main Workstation"
            subtitle="Coding Arena"
            unlocked={user.currentPhase >= 3}
            password={phase3Password}
            setPassword={setPhase3Password}
            onUnlock={() => handleUnlockPhase(3, phase3Password)}
            onEnter={() => navigate("/phase3")}
            unlocking={unlocking}
            color="emerald"
          />
        </motion.div>
      </div>

      {/* LEADERBOARD */}
      <div className="relative z-10 px-8 pb-10">
        <button
          onClick={() => navigate("/leaderboard")}
          className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all border border-yellow-500/30"
        >
          <FaTrophy className="text-yellow-400" />
          View Live Leaderboard
        </button>
      </div>
    </div>
  );
}

/* ---------------- STATUS CARD ---------------- */

function StatusCard({ title, value }) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10">
      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold mt-2 text-cyan-400">
        {value}
      </h2>
    </div>
  );
}

/* ---------------- PHASE CARD ---------------- */

function PhaseCard({
  icon,
  title,
  subtitle,
  color,
  unlocked,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      className="phase-card glass-panel rounded-3xl p-8 border border-white/10"
    >
      <div className={`text-5xl mb-6 text-${color}-400`}>
        {icon}
      </div>

      <h2 className="text-3xl font-bold">{title}</h2>

      <p className="text-gray-400 mt-2">{subtitle}</p>

      <button
        onClick={onClick}
        className="mt-6 bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-xl font-semibold"
      >
        Enter Room
      </button>
    </motion.div>
  );
}

/* ---------------- LOCKED PHASE ---------------- */

function PhaseContainer({
  icon,
  title,
  subtitle,
  unlocked,
  password,
  setPassword,
  onUnlock,
  onEnter,
  unlocking,
  color,
}) {
  return (
    <div className="glass-panel rounded-3xl p-8 border border-white/10 h-full">
      <div className={`text-5xl mb-6 text-${color}-400`}>
        {icon}
      </div>

      <h2 className="text-3xl font-bold">{title}</h2>

      <p className="text-gray-400 mt-2">{subtitle}</p>

      {unlocked ? (
        <button
          onClick={onEnter}
          className={`mt-6 bg-${color}-500 hover:bg-${color}-400 transition px-5 py-3 rounded-xl font-semibold flex items-center gap-2`}
        >
          <FaLockOpen />
          Enter System
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter Access Key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-400"
          />

          <button
            onClick={onUnlock}
            disabled={!password || unlocking}
            className="mt-4 bg-yellow-500 hover:bg-yellow-400 transition px-5 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <FaLock />
            {unlocking ? "Decrypting..." : "Unlock Phase"}
          </button>
        </>
      )}
    </div>
  );
}