import { parse } from "marked";
import Dompurify from "dompurify";

import { type Data } from "../type";
import { doc_TFIDF } from "./tf_idf";
import { SYSTEM_PROMPT } from "./system_prompt";
import { MODEL, PROMPT_WINDOW, SERVER_PORT } from "../constant";
import { buildMemory, saveConversation } from "./remember";

export async function submitPrompt(data: Data) {
  data.modelStatus = "PROCESSING";

  const { hist, prompt } = data;
  data.prompt = "";

  let summary = "";
  if (prompt.length > PROMPT_WINDOW) {
    const tfidf = doc_TFIDF(prompt);

    summary = tfidf.getSummary(10);
  }

  const u_step = hist.length;
  const a_step = hist.length + 1;

  let input = "";
  if (summary !== "") {
    input = summary;
  } else {
    input = prompt;
  }

  const user_prompt = {
    role: "user",
    content: input,
  };

  hist.push({
    step: u_step,
    convert_content: Dompurify.sanitize(await parse(prompt)),
    ...user_prompt,
  });
  const first_hist = {
    role: "system",
    content: `You are a helpful assistant called Gaius.
        The previous conversation is summarised as follows:
        ${data.brain}
        ${SYSTEM_PROMPT[data.systemPromptMode]}`,
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

  hist.push({
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
