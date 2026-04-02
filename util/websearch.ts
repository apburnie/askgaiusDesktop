import { processPrompt, outputToAns } from "./submit_prompt";
import { type Data } from "../type";

function prepPromptForWikipedia(prompt: string): string {
  const content =
    "What is the title of the Wikipedia article most relevant to the following prompt:";

  const suffix = "Just give the title and nothing else.";

  const input = [content, prompt, suffix].join("\n");

  return input;
}

async function prepForWikipedia(data: Data): Promise<string | null> {
  const input = prepPromptForWikipedia(data.prompt);

  const output = await processPrompt({
    messages: [{ role: "user", content: input }],
    data,
  });

  const { thought_result: wikiTitle, earlyExit } = await outputToAns(
    data,
    output,
  );

  if (earlyExit) {
    return null;
  }

  return wikiTitle;
}

export async function getInternetData(data: Data): Promise<string> {
  const wikiTitle = await prepForWikipedia(data);

  if (wikiTitle === null) {
    data.killStream = true;
    return "";
  }

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
