// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Phase1 from "./pages/Phase1";
// import Phase3 from "./pages/Phase3";
// import Phase2 from "./pages/Phase2";
// import Leaderboard from "./pages/Leaderboard";
// import GameRoom from "./pages/GameRoom";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/phase1" element={<Phase1 />} />
//         <Route path="/phase2" element={<Phase2 />} />
//         <Route path="/phase3" element={<Phase3 />} />
//         <Route path="/leaderboard" element={<Leaderboard />} />
//         <Route path="/room" element={<GameRoom />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Phase1 from "./pages/Phase1";
import Phase2 from "./pages/Phase2";
import Phase3 from "./pages/Phase3";
import Leaderboard from "./pages/Leaderboard";
import GameRoom from "./pages/GameRoom";

import AmbientEffects from "./components/effects/AmbientEffects";
import BackgroundMusic from "./components/audio/BackgroundMusic";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
    <div className="w-full h-full min-h-screen">
      {/* Global Effects */}
      <AmbientEffects />
      <BackgroundMusic />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />

          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />

          <Route
            path="/room"
            element={
              <PageTransition>
                <GameRoom />
              </PageTransition>
            }
          />

          <Route
            path="/phase1"
            element={
              <PageTransition>
                <Phase1 />
              </PageTransition>
            }
          />

          <Route
            path="/phase2"
            element={
              <PageTransition>
                <Phase2 />
              </PageTransition>
            }
          />

          <Route
            path="/phase3"
            element={
              <PageTransition>
                <Phase3 />
              </PageTransition>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <PageTransition>
                <Leaderboard />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      </div>
    </>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: "blur(10px)",
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
      className="min-h-screen bg-black text-white overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;