import { processPrompt, summariseContent } from "./submit_prompt";
import type { ChatCompletion, ChatCompletionChunk } from "@mlc-ai/web-llm";
import { type Data } from "../type";

function prepPromptForWikipedia(prompt: string): string {
  const content =
    "What is the title of the Wikipedia article most relevant to the following prompt:";

  const suffix = "Just give the title and nothing else.";

  const input = [content, prompt, suffix].join("\n");

  return input;
}
// TO DO - this processing must match that in submitPrompt
async function buildAns({
  data,
  output,
}: {
  data: Data;
  output: ChatCompletion & AsyncIterable<ChatCompletionChunk>;
}): Promise<string> {
  data.runAns = "";

  for await (const chunk of output) {
    data.runAns += chunk.choices[0]?.delta.content || "";
  }
  const thought_result = data.runAns.slice(data.runAns.indexOf("</think>") + 8);

  return thought_result;
}

async function prepForWikipedia(data: Data): Promise<string> {
  const input = prepPromptForWikipedia(data.prompt);

  const output = await processPrompt({
    messages: [{ role: "user", content: input }],
    data,
  });

  const wikiTitle = buildAns({ data, output });

  return wikiTitle;
}

export async function getInternetData(data: Data): Promise<string> {
  const wikiTitle = await prepForWikipedia(data);
  data.processText = `Searching for "${wikiTitle}"`;
  const saveResp = await fetch("/api/ask-wikipedia", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: wikiTitle, prompt: data.prompt }),
  });

  const { content } = (await saveResp.json()) as { content: string };

  return content;
}
