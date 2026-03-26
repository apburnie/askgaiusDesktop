import { parse } from "marked";
import Dompurify from "dompurify";

import { type Data, type SystemPromptModeType, type TFIDFType } from "../type";
import { doc_TFIDF } from "./tf_idf";
import { SYSTEM_PROMPT } from "./system_prompt";
import { PROMPT_WINDOW } from "../constant";
import { buildMemory, getClosestSummary, saveConversation } from "./remember";

import { env, pipeline } from "@huggingface/transformers";

function buildUserContent(prompt: string): string {
  let summary = "";
  if (prompt.length > PROMPT_WINDOW) {
    const tfidf = doc_TFIDF(prompt);
    summary = tfidf.getSummary(10);
  }

  let input = "";
  if (summary !== "") {
    input = summary;
  } else {
    input = prompt;
  }

  return input;
}

async function buildSystemContent({
  internal_brain,
  system_prompt_mode,
  id,
  tfidf,
}: {
  internal_brain: string;
  system_prompt_mode: SystemPromptModeType;
  id: number | null;
  tfidf: TFIDFType;
}): Promise<string> {
  const system_content = ["You are a helpful assistant called Gaius."];

  if (system_prompt_mode !== "BASE") {
    system_content.push(SYSTEM_PROMPT[system_prompt_mode]);
    return system_content.join(" ");
  }

  console.log("submitted to get external brain", { id, tfidf });

  const external_brain = await getClosestSummary({ id, tfidf });

  console.log("external brain", external_brain);

  if (external_brain !== "" || internal_brain !== "") {
    system_content.push("The previous conversation is summarised as follows:");
  }

  if (external_brain !== "") {
    system_content.push(external_brain);
  }

  if (internal_brain !== "") {
    system_content.push(internal_brain);
  }

  return system_content.join(" ");
}

export async function submitPrompt(data: Data) {
  const path = "./model";

  console.log("using path", path);

  env.localModelPath = path;
  env.allowRemoteModels = false;
  env.allowLocalModels = true;

  data.modelStatus = "PROCESSING";

  const user_content = buildUserContent(data.prompt);

  console.log("USER", user_content);

  // Update history for user prompt
  const u_step = data.hist.length;
  const a_step = data.hist.length + 1;
  const user_prompt = {
    role: "user",
    content: user_content,
  };
  data.hist.push({
    step: u_step,
    convert_content: Dompurify.sanitize(await parse(data.prompt)),
    ...user_prompt,
  });

  await buildMemory(data);
  data.prompt = "";

  // Create System Prompt
  const system_content = await buildSystemContent({
    internal_brain: data.brain,
    system_prompt_mode: data.systemPromptMode,
    id: data.currentID,
    tfidf: data.tfidf,
  });

  console.log("SYSTEM", system_content);
  const first_hist = {
    role: "system",
    content: system_content,
  };

  const messages = [first_hist, user_prompt];

  console.log("create pipeline");

  const pipe = await pipeline(
    "text-generation",
    "onnx-community/Qwen3.5-4B-ONNX",
    {
      dtype: "q4",
      device: "webgpu",
    },
  );

  console.log("use pipeline");
  const output = await pipe(messages, {
    max_new_tokens: 1024,
    temperature: 0.7,
    top_k: 20,
    top_p: 0.8,
    tokenizer_encode_kwargs: {
      enable_thinking: false,
    },
  });

  const full_content = output[0]?.generated_text!;

  const assistant_content = full_content[full_content?.length - 1]?.content!;

  data.hist.push({
    step: a_step,
    role: "assistant",
    content: assistant_content,
    convert_content: Dompurify.sanitize(parse(assistant_content)),
  });

  // Remember the answer
  await buildMemory(data);
  await saveConversation(data);

  data.modelStatus = "LOADED";
}
