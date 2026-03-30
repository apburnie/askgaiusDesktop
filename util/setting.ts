import { type Data } from "../type";

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
