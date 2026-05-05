import API from "./api";

export const unlockPhase = (data) =>
  API.post("/phase/unlock", data);