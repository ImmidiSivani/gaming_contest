import { useEffect } from "react";
import gsap from "gsap";

export default function AmbientEffects() {
  useEffect(() => {
    gsap.to(".floating-orb", {
      y: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="floating-orb absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />
      <div className="floating-orb absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="floating-orb absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full" />
    </div>
  );
}