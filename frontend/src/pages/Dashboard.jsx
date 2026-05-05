import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { unlockPhase } from "../services/phaseService";
import { getProfile } from "../services/authService";

export default function Dashboard() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unlocking, setUnlocking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phase2Password, setPhase2Password] = useState("");
  const [phase3Password, setPhase3Password] = useState("");

  useEffect(() => {
    // Refresh user data to get latest phase/status
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
    
    // Refresh every 10 seconds to update scores
    const interval = setInterval(fetchUserData, 10000);
    return () => clearInterval(interval);
  }, [setUser]);

  const handleUnlockPhase = async (phase, password) => {
    setUnlocking(true);
    try {
      console.log('Unlocking phase:', phase, 'with password:', password);
      const res = await unlockPhase({ phase, password });
      console.log('Unlock response:', res.data);
      
      setUser(res.data.data.user);
      console.log('Updated user:', res.data.data.user);
      
      // Show success message
      alert(`Phase ${phase} unlocked! Redirecting to phase page...`);
      
      // Clear password after successful unlock
      if (phase === 2) setPhase2Password("");
      if (phase === 3) setPhase3Password("");
      
      // Navigate to the unlocked phase
      console.log('Navigating to:', `/phase${phase}`);
      navigate(`/phase${phase}`);
    } catch (error) {
      console.error('Unlock error:', error);
      alert(error.response?.data?.message || 'Failed to unlock phase');
    } finally {
      setUnlocking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login first</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <p><strong>Current Phase:</strong> {user.currentPhase}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Total Score:</strong> {user.totalScore || 0}</p>
        <p><strong>Phase 1 Score:</strong> {user.phase1Score || 0}</p>
        <p><strong>Phase 2 Score:</strong> {user.phase2Score || 0}</p>
        
        {/* Show generated passwords if qualified */}
        {user.phasePasswords?.phase2?.password && (
          <p className="text-green-600 mt-2">
            🎉 Phase 2 Password: <strong>{user.phasePasswords.phase2.password}</strong>
            {user.phasePasswords.phase2.used && <span className="text-gray-500 ml-2">(Used)</span>}
          </p>
        )}
        {user.phasePasswords?.phase3?.password && (
          <p className="text-green-600 mt-2">
            🎉 Phase 3 Password: <strong>{user.phasePasswords.phase3.password}</strong>
            {user.phasePasswords.phase3.used && <span className="text-gray-500 ml-2">(Used)</span>}
          </p>
        )}
        
        {user.isQualified === false && (
          <p className="text-red-500 mt-2">
            ❌ You have been eliminated. Cannot proceed further.
          </p>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Available Phases</h2>

      <div className="grid gap-4">
        {/* Phase 1 */}
        <div className="border p-4 rounded">
          <h3 className="font-bold">Phase 1 - MCQ</h3>
          <p className="text-gray-600">Answer multiple choice questions</p>
          <button 
            onClick={() => navigate("/phase1")}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            Go to Phase 1
          </button>
        </div>

        {/* Phase 2 */}
        <div className="border p-4 rounded">
          <h3 className="font-bold">Phase 2 - Debugging</h3>
          <p className="text-gray-600">Fix bugs in given code</p>
          {user.currentPhase >= 2 ? (
            <button 
              onClick={() => navigate("/phase2")}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
            >
              Go to Phase 2
            </button>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter Phase 2 password"
                value={phase2Password}
                onChange={(e) => setPhase2Password(e.target.value)}
                className="border p-2 rounded mt-2 w-full"
                disabled={unlocking}
              />
              <button 
                onClick={() => handleUnlockPhase(2, phase2Password)}
                disabled={unlocking || !phase2Password || user.currentPhase < 1}
                className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded disabled:bg-gray-300"
              >
                {unlocking ? 'Unlocking...' : 'Unlock Phase 2'}
              </button>
            </div>
          )}
        </div>

        {/* Phase 3 */}
        <div className="border p-4 rounded">
          <h3 className="font-bold">Phase 3 - Coding</h3>
          <p className="text-gray-600">Solve coding problems</p>
          {user.currentPhase >= 3 ? (
            <button 
              onClick={() => navigate("/phase3")}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
            >
              Go to Phase 3
            </button>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter Phase 3 password"
                value={phase3Password}
                onChange={(e) => setPhase3Password(e.target.value)}
                className="border p-2 rounded mt-2 w-full"
                disabled={unlocking}
              />
              <button 
                onClick={() => handleUnlockPhase(3, phase3Password)}
                disabled={unlocking || !phase3Password || user.currentPhase < 2}
                className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded disabled:bg-gray-300"
              >
                {unlocking ? 'Unlocking...' : 'Unlock Phase 3'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={() => navigate("/leaderboard")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
}