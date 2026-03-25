import type { ConversationData } from "./type";

export const UI_PORT = 2000;
export const PROMPT_WINDOW = 500;

export const DEFAULT_DATA: ConversationData = {
  currentID: null,
  headerText: "",
  hist: [],
  brain: "",
  tfidf: {},
};
