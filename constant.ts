import type { ConversationData } from "./type";

export const UI_PORT = 2000;
export const PROMPT_WINDOW = 500;

export const DEFAULT_DATA: ConversationData = {
  currentID: null,
  headerText: "Welcome to AskGaius",
  hist: [],
  brain: "",
  tfidf: {},
};

export const MIMIR_PATH = "./output/mimir/mimir.json";
export const MODEL_PATH = "./model/Qwen3";
