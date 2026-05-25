// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export default function Login() {
//   const { loginUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await loginUser(form);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2">Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p className="mt-4 text-center text-gray-600">
//           Don't have an account?{" "}
//           <span 
//             onClick={() => navigate("/register")} 
//             className="text-green-500 cursor-pointer hover:underline"
//           >
//             Register
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// }



import { useState, useContext, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { motion } from "framer-motion";

import gsap from "gsap";

 import { Howl } from "howler";

import {
  FaLock,
  FaUserSecret,
  FaTerminal,
} from "react-icons/fa";

/* ---------------- AUDIO ---------------- */

const hoverSound = new Howl({
  src: ["/sounds/hover.mp3"],
  volume: 0.25,
});

const clickSound = new Howl({
  src: ["/sounds/click.mp3"],
  volume: 0.4,
});

const errorSound = new Howl({
  src: ["/sounds/error.mp3"],
  volume: 0.4,
});

const ambientMusic = new Howl({
  src: ["/sounds/login-ambient.mp3"],
  volume: 0.25,
  loop: true,
});

/* ---------------- MAIN ---------------- */

export default function Login() {
  const { loginUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const containerRef = useRef();

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    ambientMusic.play();

    gsap.fromTo(
      ".login-panel",
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power4.out",
      }
    );

    gsap.to(".ambient-glow", {
      opacity: 0.7,
      duration: 3,
      repeat: -1,
      yoyo: true,
    });

    return () => {
      ambientMusic.stop();
    };
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    clickSound.play();

    setError("");

    setLoading(true);

    try {
      await loginUser(form);

      gsap.to(".login-panel", {
        scale: 1.03,
        duration: 0.2,
        repeat: 1,
        yoyo: true,
      });

      setTimeout(() => {
        navigate("/room");
      }, 900);
    } catch (err) {
      errorSound.play();

      gsap.fromTo(
        ".login-panel",
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

      setError(
        err.response?.data?.message ||
          "Access denied. Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#050816] overflow-hidden flex items-center justify-center cyber-grid"
    >
      {/* BACKGROUND LIGHTS */}
      <div className="ambient-glow absolute top-10 left-20 w-96 h-96 bg-cyan-500/20 blur-[140px]" />

      <div className="ambient-glow absolute bottom-10 right-20 w-96 h-96 bg-purple-500/20 blur-[140px]" />

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* LOGIN PANEL */}
      <motion.form
        onSubmit={handleSubmit}
        className="login-panel relative z-10 w-[420px] glass-panel rounded-[30px] p-10 border border-cyan-500/20 shadow-[0_0_60px_rgba(0,255,255,0.1)]"
      >
        {/* TOP */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-4xl mb-4 neon-border">
            <FaUserSecret />
          </div>

          <h1 className="text-4xl font-bold text-cyan-400">
            Escape Access
          </h1>

          <p className="text-gray-400 mt-3 text-center">
            Authenticate to enter the coding facility
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-2 block">
            Agent Email
          </label>

          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-cyan-400 transition"
              required
            />

            <FaTerminal className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400" />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <label className="text-gray-300 text-sm mb-2 block">
            Access Key
          </label>

          <div className="relative">
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-cyan-400 transition"
              required
            />

            <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400" />
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onMouseEnter={() => hoverSound.play()}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(0,255,255,0.25)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50"
        >
          {loading
            ? "Decrypting Credentials..."
            : "ENTER FACILITY"}
        </motion.button>

        {/* REGISTER */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          New contestant?{" "}
          <span
            onClick={() => {
              clickSound.play();
              navigate("/register");
            }}
            className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition"
          >
            Create Access Profile
          </span>
        </div>
      </motion.form>
    </div>
  );
}