import type { ConversationData } from "./type";

export const LLAMA_CPP_VERSION = "b8352";
export const MODEL = "Qwen3.5-9B-Q4_K_M.gguf";
export const UI_PORT = 2000;
export const SERVER_PORT = 2001;
export const PROMPT_WINDOW = 500;

export const DEFAULT_DATA: ConversationData = {
  currentID: null,
  headerText: "",
  hist: [],
  brain: `The name of the assistant is Gaius`,
  tfidf: {},
};
