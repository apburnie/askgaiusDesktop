import Alpine from "alpinejs";

import { Home, Converse } from "./component/page";
import { MODEL, SERVER_PORT } from "./constant";

import { parse } from "marked";
import Dompurify from "dompurify";

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
  main,
  func_s: {
    async submitPrompt(data: Data) {
      data.modelStatus = "PROCESSING";
      const { hist, prompt } = data;

      const u_step = hist.length;
      const a_step = hist.length + 1;
      hist.push({
        step: u_step,
        role: "user",
        content: prompt,
        convert_content: Dompurify.sanitize(await parse(prompt)),
      });

      const body = {
        model: MODEL,
        messages: hist,
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

      console.log("RESPONSE", json);

      const assistant_answer = json.choices[0]?.message.content || "";

      hist.push({
        step: a_step,
        role: "assistant",
        content: assistant_answer,
        convert_content: Dompurify.sanitize(await parse(assistant_answer)),
      });
      data.prompt = "";

      data.modelStatus = "LOADED";
    },
    async startServer(data: Data) {
      if (data.page === "CONVERSE") {
        await fetch("/start-server", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ os: data.os, hardware: data.hardware }),
        });
      }
    },
    async pollServer(data: Data) {
      if (data.page === "CONVERSE") {
        const refreshID = setInterval(async () => {
          console.log("check health");
          const resp = await fetch(`http://localhost:${SERVER_PORT}/health`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const json = await resp.json();

          if (json?.status === "ok") {
            data.modelStatus = "LOADED";
            clearInterval(refreshID);
          }
        }, 1000);
      }
    },
  },
});

Alpine.data("data", data);

Alpine.start();
