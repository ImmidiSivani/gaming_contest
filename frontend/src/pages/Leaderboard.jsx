import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { getLeaderboard } from "../services/leaderboardService";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    getLeaderboard()
      .then((res) => {
        setData(res.data.data.leaderboard);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load leaderboard');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("leaderboardUpdate", (update) => {
      setData(update.leaderboard);
    });

    return () => {
      socket.off("leaderboardUpdate");
    };
  }, [socket]);

  if (loading) return <div className="p-4">Loading leaderboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>

      {data.length === 0 ? (
        <p>No participants yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Rank</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Phase</th>
                <th className="border p-2">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id} className="text-center">
                  <td className="border p-2">
                    {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                  </td>
                  <td className="border p-2 font-medium">{u.name}</td>
                  <td className="border p-2">{u.currentPhase}</td>
                  <td className="border p-2 font-bold">{u.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}