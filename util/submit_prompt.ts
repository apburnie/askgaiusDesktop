import { parse } from "marked";
import Dompurify from "dompurify";

import { type Data, type SystemPromptModeType, type TFIDFType } from "../type";
import { doc_TFIDF } from "./tf_idf";
import { SYSTEM_PROMPT } from "./system_prompt";
import { MODEL, PROMPT_WINDOW, SERVER_PORT } from "../constant";
import { buildMemory, getClosestSummary, saveConversation } from "./remember";

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
  const body = {
    model: MODEL,
    messages: [first_hist, user_prompt],
  };

  const resp = await fetch(
    `http://localhost:${SERVER_PORT}/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer no-key",
      },
      body: JSON.stringify(body),
    },
  );

  const json = (await resp.json()) as {
    choices: { message: { content: string } }[];
  };

  const assistant_answer = json.choices[0]?.message.content || "";

  data.hist.push({
    step: a_step,
    role: "assistant",
    content: assistant_answer,
    convert_content: Dompurify.sanitize(await parse(assistant_answer)),
  });

  // Remember the answer
  await buildMemory(data);
  await saveConversation(data);

  data.modelStatus = "LOADED";
}
