import type { ConversationData } from "./type";

export const MODEL = "Qwen3.5-4B-UD-IQ2_XXS.gguf";
export const UI_PORT = 2000;
export const SERVER_PORT = 2001;
export const PROMPT_WINDOW = 500;

export const DEFAULT_DATA: ConversationData = {
  currentID: null,
  headerText: "",
  hist: [],
  brain: "",
  tfidf: {},
};
