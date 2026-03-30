import { Data } from "../type";
import { processPrompt } from "./submit_prompt";
import type { ChatCompletion, ChatCompletionChunk } from "@mlc-ai/web-llm";

function prepPromptForWikipedia(prompt: string): string {
  const content =
    "What is the title of the Wikipedia article most relevant to the following prompt:";

  const suffix = "Just give the title and nothing else.";

  const input = [content, prompt, suffix].join("\n");

  return input;
}
// TO DO - this processing must match that in submitPrompt
async function buildAns({
  output,
}: {
  output: ChatCompletion & AsyncIterable<ChatCompletionChunk>;
}): Promise<string> {
  let runAns = "";

  for await (const chunk of output) {
    runAns += chunk.choices[0]?.delta.content || "";
  }
  const thought_result = runAns.slice(runAns.indexOf("</think>") + 8);

  return thought_result;
}

async function prepForWikipedia({ data }: { data: Data }): Promise<string> {
  const input = prepPromptForWikipedia(data.prompt);

  const output = await processPrompt({
    messages: [{ role: "user", content: input }],
    data,
  });

  const wikiTitle = buildAns({ output });

  return wikiTitle;
}

export async function getInternetData({
  data,
}: {
  data: Data;
}): Promise<string> {
  data.headerText = "Fine-tuning Web Search";
  const wikiTitle = await prepForWikipedia({ data });

  data.headerText = "Conducting Web Search";
  const saveResp = await fetch("/api/ask-wikipedia", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: wikiTitle }),
  });

  const { content } = (await saveResp.json()) as { content: string };

  return content;
}
