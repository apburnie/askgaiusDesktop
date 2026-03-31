import { parse } from "marked";
import Dompurify from "dompurify";

import {
  type Data,
  type MessageS,
  type SystemPromptModeType,
  type TFIDFType,
} from "../type";
import { doc_TFIDF } from "./tf_idf";
import { SYSTEM_PROMPT } from "./system_prompt";
import { PROMPT_WINDOW } from "../constant";
import { buildMemory, getClosestSummary, saveConversation } from "./remember";
import { getInternetData } from "./websearch";

export function summariseContent(prompt: string): string {
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
  prompt,
}: {
  internal_brain: string;
  system_prompt_mode: SystemPromptModeType;
  id: number | null;
  tfidf: TFIDFType;
  prompt: string;
}): Promise<string> {
  console.log("SPM", system_prompt_mode);

  let mode: keyof typeof SYSTEM_PROMPT = "BASE";

  if (["GOLDFISH", "BASE", "WEBSEARCH"].includes(system_prompt_mode)) {
    mode = "BASE";
  } else {
    mode = system_prompt_mode as "PROMPT_TRAINER";
  }

  const system_content = [SYSTEM_PROMPT[mode]];

  if (system_prompt_mode === "PROMPT_TRAINER") {
    system_content.push(`
      Evaluate the following prompt:

      `);
  }

  if (!["PROMPT_TRAINER", "GOLDFISH"].includes(system_prompt_mode)) {
    console.log("submitted to get external brain", { id, tfidf });

    const external_brain = await getClosestSummary({ id, tfidf });

    if (external_brain !== "" || internal_brain !== "") {
      system_content.push(
        "The previous conversation is summarised as follows:\n",
      );
    }

    if (external_brain !== "") {
      system_content.push(external_brain);
    }

    if (internal_brain !== "") {
      system_content.push(internal_brain);
    }

    if (system_prompt_mode === "WEBSEARCH") {
      const wikiText = await getInternetData({ prompt });

      system_content.push("Here is some data on the topic from Wikipedia:\n");
      system_content.push(wikiText + "\n");
    }

    if (external_brain !== "" || internal_brain !== "") {
      system_content.push("\n\nRespond to the following prompt:\n");
    }
  }

  return system_content.join(" ");
}

export async function processPrompt({
  messages,
  data,
}: {
  messages: MessageS;
  data?: Data;
}) {
  const modelPath = new URL("./model/Qwen3", window.location.origin).href;
  const modelLib = new URL(
    "./model/Qwen3/Qwen3-4B-q4f16_1-ctx4k_cs1k-webgpu.wasm",
    window.location.origin,
  ).href;

  const model = {
    model: modelPath,
    model_id: "Qwen3",
    model_lib: modelLib,
  };

  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");

  const engine = await CreateMLCEngine(model.model_id, {
    appConfig: { model_list: [model] },
    initProgressCallback: (progress) => {
      if (data !== undefined) {
        data.headerText = `Model Loading: ${progress.text}`;
      }
    },
  });

  const output = await engine.chat.completions.create({
    messages,
    stream: true,
    repetition_penalty: 1.2,
    temperature: 0.5,
    top_p: 0.95,
    stream_options: { include_usage: true },
    enable_thinking: false,
  });

  return output;
}

export async function submitPrompt(data: Data) {
  data.modelStatus = "PROCESSING";

  // TO DO - Switch model to Qwen 3.5 when it is available
  // const model = {
  //   model_id: "Qwen3-1.7B-q4f32_1-MLC",
  // };
  //
  // const model = {
  //   model_id: "Ministral-3-3B-Reasoning-2512-q4f16_1-MLC",
  // };
  //

  const user_content = summariseContent(data.prompt);

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
    convert_thought: "",
    ...user_prompt,
  });

  await buildMemory(data);
  const prompt = data.prompt;

  data.prompt = "";

  // Create System Prompt
  const system_content = await buildSystemContent({
    internal_brain: data.brain,
    system_prompt_mode: data.systemPromptMode,
    id: data.currentID,
    tfidf: data.tfidf,
    prompt,
  });

  const first_hist = {
    role: "system",
    content: system_content,
  };

  const messages: MessageS = [first_hist, user_prompt];

  console.log("SYSTEM CONTENT", messages[0].content);
  console.log("USER CONTENT", messages[1].content);

  const output = await processPrompt({ messages, data });

  data.runAns = "";

  for await (const chunk of output) {
    data.runAns += chunk.choices[0]?.delta.content || "";

    if (data.killStream) {
      data.killStream = false;
      break;
    }
  }

  let thought = data.runAns.slice(
    data.runAns.indexOf("<think>") + 7,
    data.runAns.indexOf("</think>"),
  );
  const thought_result = data.runAns.slice(data.runAns.indexOf("</think>") + 8);

  if (thought === thought_result) {
    thought = "";
  }

  data.runAns = null;

  data.hist.push({
    step: a_step,
    role: "assistant",
    content: thought_result,
    convert_content: Dompurify.sanitize(parse(thought_result)),
    convert_thought: Dompurify.sanitize(parse(thought)),
  });

  await buildMemory(data);
  await saveConversation(data);

  data.modelStatus = "LOADED";
}
