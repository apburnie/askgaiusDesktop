import type {
  ConverseSubPageType,
  ModelStatusType,
  PageType,
  SystemPromptModeType,
} from "./type";

export const LLAMA_CPP_VERSION = "b8352";
export const MODEL = "Qwen3.5-9B-Q4_K_M.gguf";
export const UI_PORT = 2000;
export const SERVER_PORT = 2001;
export const PROMPT_WINDOW = 500;

export const DEFAULT_DATA = {
  currentID: null,
  page: "HOME" as PageType,
  hist: [],
  headerText: "",
  prompt: "",
  os: "UBUNTU",
  hardware: "vulkan",
  modelStatus: "UNLOADED" as ModelStatusType,
  brain: `The name of the assistant is Gaius`,
  systemPromptMode: "BASE" as SystemPromptModeType,
  converseSubPage: "CONVERSE" as ConverseSubPageType,
  tfidf: {},
  loadMeta: [],
};
