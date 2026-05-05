import API from "./api";

export const getQuestions = (phase, type) =>
  API.get(`/questions/${phase}`, {
    params: type ? { type } : {},
  });