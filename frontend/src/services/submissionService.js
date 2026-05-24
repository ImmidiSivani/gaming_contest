import API from "./api";

export const submitMCQ = (data) =>
  API.post("/submissions/mcq", data);

export const submitDebug = (data) => {
  console.log('Frontend submitDebug data:', data);
  return API.post("/submissions/debug", data);
};

export const runDebug = (data) => {
  console.log('Frontend runDebug data:', data);
  return API.post("/submissions/debug/run", data);
};

export const submitCode = (data) =>
  API.post("/submissions/code", data);