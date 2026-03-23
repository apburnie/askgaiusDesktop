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
  brain: "",
  tfidf: {},
};

export const OS = ["UBUNTU", "WINDOWS"];

export const HARDWARE = {
  UBUNTU: ["x64", "vulkan", "s390x", "rocm", "openvino"],
  WINDOWS: ["vulkan", "sycl", "hip", "cuda13", "cuda12", "cpuX64", "cpuARM64"],
};
