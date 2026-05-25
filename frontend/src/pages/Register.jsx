// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { register } from "../services/authService";

// export default function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ 
//     name: "", 
//     email: "", 
//     password: "",
//     confirmPassword: "" 
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     try {
//       await register({ 
//         name: form.name,
//         email: form.email, 
//         password: form.password 
//       });
//       alert("Registration successful! Please login.");
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Name</label>
//           <input
//             type="text"
//             placeholder="Enter your name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>

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

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Password</label>
//           <input
//             type="password"
//             placeholder="Create a password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//             minLength={6}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2">Confirm Password</label>
//           <input
//             type="password"
//             placeholder="Confirm your password"
//             value={form.confirmPassword}
//             onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading}
//           className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-green-300"
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>

//         <p className="mt-4 text-center text-gray-600">
//           Already have an account?{" "}
//           <span 
//             onClick={() => navigate("/")} 
//             className="text-blue-500 cursor-pointer hover:underline"
//           >
//             Login
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// }




import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import gsap from "gsap";

import { Howl } from "howler";

import {
  FaUserAstronaut,
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

import { register } from "../services/authService";

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

const registerAmbient = new Howl({
  src: ["/sounds/register-ambient.mp3"],
  volume: 0.25,
  loop: true,
});

/* ---------------- MAIN ---------------- */

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    registerAmbient.play();

    gsap.fromTo(
      ".register-panel",
      {
        opacity: 0,
        y: 40,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power4.out",
      }
    );

    gsap.to(".register-glow", {
      opacity: 0.7,
      duration: 3,
      repeat: -1,
      yoyo: true,
    });

    return () => {
      registerAmbient.stop();
    };
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    clickSound.play();

    setError("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      errorSound.play();

      setError(
        "Security keys do not match"
      );

      gsap.fromTo(
        ".register-panel",
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

      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      successSound.play();

      gsap.to(".register-panel", {
        scale: 1.03,
        duration: 0.2,
        repeat: 1,
        yoyo: true,
      });

      setTimeout(() => {
        alert(
          "🎉 Registration Successful!\nAccess terminal created."
        );

        navigate("/");
      }, 800);
    } catch (err) {
      console.error(err);

      errorSound.play();

      gsap.fromTo(
        ".register-panel",
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
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative min-h-screen bg-[#050816] overflow-hidden flex items-center justify-center cyber-grid">
      {/* BACKGROUND */}
      <div className="register-glow absolute top-10 left-20 w-96 h-96 bg-purple-500/20 blur-[140px]" />

      <div className="register-glow absolute bottom-10 right-20 w-96 h-96 bg-cyan-500/20 blur-[140px]" />

      {/* PARTICLES */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
            }}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* PANEL */}
      <motion.form
        onSubmit={handleSubmit}
        className="register-panel relative z-10 w-[450px] glass-panel rounded-[30px] p-10 border border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.15)]"
      >
        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-4xl mb-4 neon-border">
            <FaUserAstronaut />
          </div>

          <h1 className="text-4xl font-bold text-purple-400">
            Contest Registration
          </h1>

          <p className="text-gray-400 mt-3 text-center">
            Create your hacker profile to
            enter the facility
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

        {/* NAME */}
        <InputField
          icon={<FaUser />}
          label="Agent Name"
          type="text"
          placeholder="Enter your codename"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        {/* EMAIL */}
        <InputField
          icon={<FaEnvelope />}
          label="Agent Email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        {/* PASSWORD */}
        <InputField
          icon={<FaLock />}
          label="Access Key"
          type="password"
          placeholder="Create password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        {/* CONFIRM */}
        <InputField
          icon={<FaShieldAlt />}
          label="Confirm Access Key"
          type="password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword:
                e.target.value,
            })
          }
        />

        {/* BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onMouseEnter={() =>
            hoverSound.play()
          }
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 mt-4"
        >
          {loading
            ? "Creating Access Profile..."
            : "ENTER COMPETITION"}
        </motion.button>

        {/* LOGIN */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already registered?{" "}
          <span
            onClick={() => {
              clickSound.play();

              navigate("/");
            }}
            className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition"
          >
            Login Here
          </span>
        </div>
      </motion.form>
    </div>
  );
}

/* ---------------- INPUT FIELD ---------------- */

function InputField({
  icon,
  label,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-5">
      <label className="text-gray-300 text-sm mb-2 block">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-400 transition"
          required
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
          {icon}
        </div>
      </div>
    </div>
  );
}