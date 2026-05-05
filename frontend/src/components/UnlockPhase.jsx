import { useState } from "react";
import { unlockPhase } from "../services/phaseService";

export default function UnlockPhase({ phase }) {
  const [password, setPassword] = useState("");

  const handleUnlock = async () => {
    try {
      await unlockPhase({ phase, password });
      alert("Unlocked!");
      window.location.reload();
    } catch {
      alert("Wrong password");
    }
  };

  return (
    <div>
      <input
        placeholder="Enter phase password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUnlock}>Unlock Phase</button>
    </div>
  );
}