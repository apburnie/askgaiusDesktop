import { parse } from "marked";
import Dompurify from "dompurify";

import { type Data, type MessageS } from "../type";
import { doc_TFIDF } from "./tf_idf";
import { SYSTEM_PROMPT } from "./system_prompt";
import { MODEL_PATH, PROMPT_WINDOW } from "../constant";
import { buildMemory, getClosestSummary, saveConversation } from "./remember";
import { getInternetData } from "./websearch";
import type { ChatCompletion, ChatCompletionChunk } from "@mlc-ai/web-llm";

export function summariseContent(prompt?: string): string {
  if (!prompt) {
    return "";
  }

  let summary = "";
  if (prompt.length > PROMPT_WINDOW) {
    const tfidf = doc_TFIDF(prompt);
    summary = tfidf.getSummary(100);
  }

  let input = "";
  if (summary !== "") {
    input = summary;
  } else {
    input = prompt;
  }

  return input;
}

async function buildSystemContent(data: Data): Promise<string> {
  const {
    systemPromptMode,
    brain: internal_brain,
    currentID: id,
    tfidf,
  } = data;
  console.log("SPM", systemPromptMode);

  let mode: keyof typeof SYSTEM_PROMPT = "BASE";

  if (["GOLDFISH", "BASE", "WEBSEARCH"].includes(systemPromptMode)) {
    mode = "BASE";
  } else {
    mode = systemPromptMode as "PROMPT_TRAINER";
  }

  const system_content = [SYSTEM_PROMPT[mode]];

  if (systemPromptMode === "PROMPT_TRAINER") {
    system_content.push(`
      Evaluate the following prompt:

      `);
  }

  if (!["PROMPT_TRAINER", "GOLDFISH"].includes(systemPromptMode)) {
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

    if (systemPromptMode === "WEBSEARCH") {
      data.processText = "Preparing Web Search...";
      const wikiText = await getInternetData(data);
      if (wikiText.trim() !== "") {
        system_content.push("Here is some data on the topic from Wikipedia:\n");
        system_content.push(wikiText + "\n");
      }
    }

    if (external_brain !== "" || internal_brain !== "") {
      system_content.push("\n\nRespond to the following prompt:\n");
    }
  }

  return system_content.join(" ");
}

export async function outputToAns(
  data: Data,
  output: ChatCompletion & AsyncIterable<ChatCompletionChunk>,
): Promise<{ thought: string; thought_result: string; earlyExit: boolean }> {
  let earlyExit = false;

  data.runAns = "";

  for await (const chunk of output) {
    data.runAns += chunk.choices[0]?.delta.content || "";

    if (data.killStream) {
      data.killStream = false;
      earlyExit = true;
      break;
    }
  }

  const thought_begin = data.runAns.indexOf("<think>") + 7;
  const thought_end = data.runAns.indexOf("</think>");

  let thought = data.runAns.slice(
    thought_begin,
    thought_end === -1 ? data.runAns.length : thought_end,
  );

  const thought_result = data.runAns.slice(data.runAns.indexOf("</think>") + 8);

  if (thought === thought_result) {
    thought = "";
  }

  data.runAns = null;

  return { thought, thought_result, earlyExit };
}

export async function processPrompt({
  messages,
  data,
}: {
  messages: MessageS;
  data?: Data;
}) {
  const modelPath = new URL(MODEL_PATH, window.location.origin).href;
  const modelLib = new URL(
    `${MODEL_PATH}/Qwen3-4B-q4f16_1-ctx4k_cs1k-webgpu.wasm`,
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
        data.processText = progress.text;
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

  // Create System Prompt
  const system_content = await buildSystemContent(data);

  const first_hist = {
    role: "system",
    content: system_content,
  };

  const messages: MessageS = [first_hist, user_prompt];

  console.log("SYSTEM CONTENT", messages[0].content);
  console.log("USER CONTENT", messages[1].content);

  if (data.killStream) {
    data.killStream = false;
    data.modelStatus = "LOADED";
    data.hist.pop();
    return;
  }

  const output = await processPrompt({ messages, data });

  const { thought, thought_result, earlyExit } = await outputToAns(
    data,
    output,
  );

  if (earlyExit) {
    data.modelStatus = "LOADED";
    data.hist.pop();
    return;
  }

  data.hist.push({
    step: a_step,
    role: "assistant",
    content: thought_result,
    convert_content: Dompurify.sanitize(parse(thought_result)),
    convert_thought: Dompurify.sanitize(parse(thought)),
  });
  data.prompt = "";

  await buildMemory(data);
  await saveConversation(data);

  data.modelStatus = "LOADED";
}
