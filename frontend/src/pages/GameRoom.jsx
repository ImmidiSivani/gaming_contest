// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Text } from "@react-three/drei";

// function Floor() {
    
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
//       <planeGeometry args={[30, 30]} />
//       <meshStandardMaterial color="#2c2c2c" />
//     </mesh>
//   );
// }

// function Wall({ position, rotation }) {
//      const navigate = useNavigate();
//   return (
//     <mesh position={position} rotation={rotation}>
//       <planeGeometry args={[30, 10]} />
//       <meshStandardMaterial color="#444" />
//     </mesh>
//   );
// }

// function Table() {
//      const navigate = useNavigate();
//   return (
//     <mesh position={[0, 1, 0]} castShadow>
//       <boxGeometry args={[6, 0.5, 3]} />
//       <meshStandardMaterial color="#654321" />
//     </mesh>
//   );
// }

// function Paper() {
//      const navigate = useNavigate();
//   return (
//     <mesh
//       position={[-2, 1.4, 0]}
//       onClick={() => navigate('/phase1')}
//     >
//       <boxGeometry args={[1, 0.05, 1]} />
//       <meshStandardMaterial color="white" />

//       <Text
//         position={[0, 0.1, 0]}
//         fontSize={0.15}
//         color="black"
//         anchorX="center"
//         anchorY="middle"
//       >
//         MCQ
//       </Text>
//     </mesh>
//   );
// }

// function Tablet() {
//      const navigate = useNavigate();
//   return (
//     <mesh
//       position={[0, 1.4, 0]}
//       onClick={() => navigate('/phase2')}
//     >
//       <boxGeometry args={[1.2, 0.1, 1.5]} />
//       <meshStandardMaterial color="black" />

//       <Text
//         position={[0, 0.1, 0]}
//         fontSize={0.15}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//       >
//         DEBUG
//       </Text>
//     </mesh>
//   );
// }

// function Computer() {
//      const navigate = useNavigate();
//   return (
//     <mesh
//       position={[2, 1.6, 0]}
//       onClick={() => navigate('/phase3')}
//     >
//       <boxGeometry args={[1.8, 1.2, 0.1]} />
//       <meshStandardMaterial color="#111" />

//       <Text
//         position={[0, 0, 0.1]}
//         fontSize={0.15}
//         color="lime"
//         anchorX="center"
//         anchorY="middle"
//       >
//         CODE
//       </Text>
//     </mesh>
//   );
// }

// export default function GameRoom() {
//      const navigate = useNavigate();
//   return (
//     <div className="w-screen h-screen">
//       <Canvas shadows camera={{ position: [0, 6, 10], fov: 50 }}>
        
//         {/* Lighting */}
//         <ambientLight intensity={0.5} />
//         <directionalLight
//           position={[5, 10, 5]}
//           intensity={1}
//           castShadow
//         />

//         {/* Controls */}
//         <OrbitControls />

//         {/* Room */}
//         <Floor />

//         <Wall position={[0, 5, -15]} rotation={[0, 0, 0]} />
//         <Wall position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]} />
//         <Wall position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]} />

//         {/* Objects */}
//         <Table />
//         <Paper />
//         <Tablet />
//         <Computer />
//       </Canvas>
//     </div>
//   );
// }




import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Environment,
  Sparkles,
} from "@react-three/drei";
import gsap from "gsap";

/* ---------------- ENVIRONMENT MESHES ---------------- */

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a1d24" roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

function Wall({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[50, 20]} />
      <meshStandardMaterial color="#2d3748" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

function DeskSetup() {
  return (
    <group position={[0, 0, 0]}>
      {/* Wooden Desk Surface */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[11, 0.12, 4.5]} />
        <meshStandardMaterial color="#d4a373" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Minimalist Desk Legs */}
      <mesh position={[-5.2, 0.6, 0]} castShadow>
        <boxGeometry args={[0.15, 1.2, 4.2]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      <mesh position={[5.2, 0.6, 0]} castShadow>
        <boxGeometry args={[0.15, 1.2, 4.2]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>

      {/* Dark Gray Felt Desk Mat */}
      <mesh position={[-0.4, 1.265, 0.6]} receiveShadow>
        <boxGeometry args={[4.5, 0.01, 1.8]} />
        <meshStandardMaterial color="#374151" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Ultra-Slim Low Profile Keyboard */}
      <mesh position={[-0.4, 1.28, 0.9]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Sleek Ergonomic Mouse */}
      <mesh position={[0.9, 1.28, 0.9]}>
        <boxGeometry args={[0.18, 0.03, 0.3]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ---------------- INTERACTIVE HARDWARE & ITEMS ---------------- */

function DesktopComputer({ onClick, locked }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.02 : 1,
        y: hovered ? 1.02 : 1,
        z: hovered ? 1.02 : 1,
        duration: 0.2,
      });
    }
  }, [hovered]);

  return (
    <group position={[-0.6, 1.26, -0.2]} ref={meshRef}>
      <group
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        onClick={onClick}
      >
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.7, 0.02, 0.6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, -0.1]} castShadow>
          <boxGeometry args={[0.2, 1.0, 0.08]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[4.2, 2.4, 0.08]} />
          <meshStandardMaterial color={hovered ? "#3b82f6" : "#cbd5e1"} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.24, 0.045]}>
          <boxGeometry args={[4.0, 2.1, 0.01]} />
          <meshStandardMaterial 
            color={locked ? "#1e1b4b" : "#0284c7"} 
            emissive={locked ? "#311042" : "#0ea5e9"} 
            emissiveIntensity={hovered ? 0.6 : 0.2} 
            roughness={0.1}
          />
        </mesh>
        <Text position={[0, 1.24, 0.06]} fontSize={0.22} color="white" anchorX="center" anchorY="middle">
          {locked ? "🔒 COMPUTER\n(LOCKED)" : "💻 COMPUTER\n[CODING]"}
        </Text>
      </group>
    </group>
  );
}

function DesktopTablet({ onClick, locked }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  return (
    <group position={[2.4, 1.26, 0.3]} rotation={[0, -Math.PI / 6, 0]} ref={meshRef}>
      <group
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        onClick={onClick}
      >
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.5, 0.02, 0.5]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.35, -0.05]} rotation={[Math.PI / 12, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.7, 0.06]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 10, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 1.3, 0.04]} />
          <meshStandardMaterial color={hovered ? "#a855f7" : "#1e293b"} metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.7, 0.022]} rotation={[-Math.PI / 10, 0, 0]}>
          <boxGeometry args={[1.7, 1.2, 0.01]} />
          <meshStandardMaterial 
            color={locked ? "#311042" : "#5b21b6"} 
            emissive={locked ? "#4a044e" : "#7c3aed"} 
            emissiveIntensity={hovered ? 0.7 : 0.2} 
          />
        </mesh>
        <Text position={[0, 0.7, 0.04]} fontSize={0.13} rotation={[-Math.PI / 10, 0, 0]} color="white" anchorX="center" anchorY="middle">
          {locked ? "🔒 TABLET\n(LOCKED)" : "📱 TABLET\n[DEBUG]"}
        </Text>
      </group>
    </group>
  );
}

function OpenNotebook({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[2.0, 1.26, 1.3]} rotation={[0, -Math.PI / 16, 0]}>
      <group
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        onClick={onClick}
      >
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.02, 1.0]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.34, 0.02, 0.94]} />
          <meshStandardMaterial color={hovered ? "#fef08a" : "#fcfcf9"} roughness={0.7} />
        </mesh>
        <Text position={[0, 0.032, 0]} fontSize={0.08} rotation={[-Math.PI / 2, 0, 0]} color="#1c1917">
          {"📝 TO-DO:\n1. Finalize MCQ\n2. Research Data\n3. Team Sync"}
        </Text>
      </group>
    </group>
  );
}

export default function GameRoom() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState("");
  const [password, setPassword] = useState("");
  const [phase2Unlocked, setPhase2Unlocked] = useState(false);
  const [phase3Unlocked, setPhase3Unlocked] = useState(false);

  const navigate = useNavigate();

  const handleLockedClick = (phase) => {
    setSelectedPhase(phase);
    setShowModal(true);
  };

  const handlePasswordSubmit = () => {
    if (selectedPhase === "phase2" && password === "DEBUG123") {
      setPhase2Unlocked(true);
      setShowModal(false);
      setPassword("");
      navigate("/phase2");
    } else if (selectedPhase === "phase3" && password === "CODE999") {
      setPhase3Unlocked(true);
      setShowModal(false);
      setPassword("");
      navigate("/phase3");
    } else {
      alert("🔒 Access Denied");
    }
  };

  return (
    // STEP 1: Force the absolute baseline container to track the viewport window dimensions
    <div className="fixed inset-0 w-screen h-screen bg-[#050816] overflow-hidden font-sans m-0 p-0">
      
      {/* HUD HEADER LAYER (Z-INDEX: 30) */}
      <div className="absolute top-0 left-0 z-30 w-full flex justify-between p-6 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl pointer-events-auto">
          <h1 className="text-white text-2xl font-bold tracking-tight">Production Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">Interact with your desk items to complete tasks.</p>
        </div>
        <button
          onClick={() => navigate("/leaderboard")}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 px-5 py-3 rounded-2xl text-white hover:bg-slate-800 transition pointer-events-auto self-start"
        >
          Leaderboard
        </button>
      </div>

      {/* SYSTEM PASSCODE SECURITY MODAL LAYER (Z-INDEX: 40) */}
      {showModal && (
        <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[400px] bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-2 tracking-wide">ENTER PASSCODE</h2>
            <p className="text-slate-400 text-sm mb-4">
              Enter authorization token to unlock the {selectedPhase === "phase2" ? "Tablet" : "Main Workstation"}.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
              placeholder="Enter Access Password"
              autoFocus
            />
            <div className="flex gap-3 mt-5">
              <button onClick={handlePasswordSubmit} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition">
                Authenticate
              </button>
              <button onClick={() => { setShowModal(false); setPassword(""); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: The Core Escape Hatch. Using inline absolute styling bypasses the parent's 400px calculation constraint */}
      <div 
        style={{ 
         position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 10,
    pointerEvents: "auto" // <-- ENSURE THIS IS SET TO AUTO
        }}
      >
        <Canvas
          shadows
          // STEP 3: Framed camera settings to optimize full screen aspect ratios
          camera={{
            position: [0, 3.1, 3.6],
            fov: 44, 
          }}
        >
          <Environment preset="studio" intensity={0.6} />
          <fog attach="fog" args={["#050816", 3, 12]} />

          <ambientLight intensity={0.5} />
          <spotLight
            position={[0, 7, 2]}
            angle={0.6}
            penumbra={0.8}
            intensity={2.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-4, 5, 2]} intensity={0.3} />

          <Floor />
          <Wall position={[0, 8, -5]} rotation={[0, 0, 0]} />
          <Wall position={[-12, 8, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Wall position={[12, 8, 0]} rotation={[0, -Math.PI / 2, 0]} />

          <DeskSetup />

          <OpenNotebook onClick={() => navigate("/phase1")} />
          <DesktopTablet 
            locked={!phase2Unlocked}
            onClick={() => {
              if (!phase2Unlocked) handleLockedClick("phase2");
              else navigate("/phase2");
            }}
          />
          <DesktopComputer 
            locked={!phase3Unlocked}
            onClick={() => {
              if (!phase3Unlocked) handleLockedClick("phase3");
              else navigate("/phase3");
            }}
          />

          <Sparkles count={50} scale={[6, 4, 5]} size={1.2} speed={0.15} color="#38bdf8" />

          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI / 2.3}
            minDistance={2.5}
            maxDistance={5.5}
          />
        </Canvas>
      </div>

    </div>
  );
}