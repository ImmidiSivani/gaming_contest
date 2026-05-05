import API from "./api";

export const getLeaderboard = () =>
  API.get("/leaderboard");