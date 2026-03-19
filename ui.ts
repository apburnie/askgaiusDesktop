import Alpine from "alpinejs";

import { Home, Converse } from "./component/page";
import { MODEL, PROMPT_WINDOW, SERVER_PORT, SUMMARY_PORT } from "./constant";

import { parse } from "marked";
import Dompurify from "dompurify";

import { summariseText } from "./util/tf_idf";

type PageType = "HOME" | "CONVERSE";
type HistType = {
  step: number;
  role: string;
  content: string;
  convert_content: string;
}[];

interface Data {
  page: PageType;
  headerText: string;
  prompt: string;
  main: string;
  func_s: Record<string, Function>;
  hist: HistType;
  os: string;
  hardware: string;
  modelStatus: "UNLOADED" | "LOADED" | "PROCESSING";
  brainKG: string;
}

const main = `${Home()}${Converse()}`;

const data: () => Data = () => ({
  page: "HOME",
  hist: [],
  headerText: "Welcome to Ask Gaius",
  prompt: "",
  os: "UBUNTU",
  hardware: "vulkan",
  modelStatus: "UNLOADED",
  brainKG: `The name of the assistant is Gaius`,
  main,
  func_s: {
    async buildMemory(data: Data) {
      const text = data.hist.map(({ content }) => content).join(" ");

      const summary = summariseText({ text, numSentence: 10 });
      data.brainKG = summary;

      data.headerText = summariseText({ text, numSentence: 2 });
    },
    async submitPrompt(data: Data) {
      data.modelStatus = "PROCESSING";
      const { hist, prompt } = data;

      let summary = "";
      if (prompt.length > PROMPT_WINDOW) {
        summary = summariseText({ text: prompt, numSentence: 10 });

        console.log("SUMMARY: ", summary);
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
        content: `The previous conversation is summarised as follows
        ${data.brainKG}
        Use this summary and your own knowledge to answer questions.`,
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

      const json: { choices: { message: { content: string } }[] } =
        await resp.json();

      const assistant_answer = json.choices[0]?.message.content || "";

      hist.push({
        step: a_step,
        role: "assistant",
        content: assistant_answer,
        convert_content: Dompurify.sanitize(await parse(assistant_answer)),
      });

      data.prompt = "";

      this.buildMemory!(data);

      data.modelStatus = "LOADED";
    },
    async startServer(data: Data) {
      if (data.page === "CONVERSE") {
        (fetch("/start-server", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ os: data.os, hardware: data.hardware }),
        }),
          await fetch("/start-summary-server", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ os: data.os, hardware: data.hardware }),
          }));
      }
    },
    async pollServer(data: Data) {
      if (data.page === "CONVERSE") {
        const refreshID = setInterval(async () => {
          console.log("check health");
          try {
            const resp = await fetch(
              `http://localhost:${SUMMARY_PORT}/health`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            const json = await resp.json();

            if (json?.status === "ok") {
              data.modelStatus = "LOADED";
              clearInterval(refreshID);
            }
          } catch {
            console.error("No server yet");
          }
        }, 1000);
      }
    },
  },
});

Alpine.data("data", data);

Alpine.start();
