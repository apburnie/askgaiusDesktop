import { type Data } from "../type";

export function activatePromptTrainer(data: Data) {
  data.systemPromptMode = "PROMPT_TRAINER";
  data.converseSubPage = "CONVERSE";
}
