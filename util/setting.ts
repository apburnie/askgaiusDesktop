import { type Data } from "../type";
import { loadConversation_s } from "./remember";

export function activatePromptTrainer(data: Data) {
  data.systemPromptMode = "PROMPT_TRAINER";
  data.converseSubPage = "CONVERSE";
}

export function activateGoldfish(data: Data) {
  data.systemPromptMode = "GOLDFISH";
  data.converseSubPage = "CONVERSE";
}

export function activateWebSearch(data: Data) {
  data.systemPromptMode = "WEBSEARCH";
  data.converseSubPage = "CONVERSE";
}

export async function goToHomePage(data: Data) {
  await loadConversation_s(data);
  data.converseSubPage = "CONVERSE";
  data.headerText = "Welcome to AskGaius";
  data.page = "HOME";
}

export async function clearSpecialMode(data: Data) {
  data.systemPromptMode = "BASE";
  data.converseSubPage = "CONVERSE";
}
