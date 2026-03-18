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
  brainKG: { subject: string; predicate: string; object: string }[];
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
  brainKG: [{ subject: "Assistant", predicate: "is called", object: "Gaius" }],
  main,
  func_s: {
    async buildMemory(data: Data) {
      const first_hist = {
        role: "system",
        content: `Your aim is to improve a subject-predicate-object knowledge graph with provided information.
        Your start with the following knowledge graph: ${JSON.stringify({ data: data.brainKG })}
        Only output the knowledge graph in the following JSON format: {"data": {"subject": string, "predicate": string, "object": string}[] }.

        `,
      };

      const last_prompt = data.hist[data.hist.length - 1];

      const input_hist = [
        first_hist,
        { role: "user", content: last_prompt?.content },
      ];

      console.log(input_hist);

      const body = {
        model: MODEL,
        messages: input_hist,
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

      console.log("KG ans", json);

      const assistant_answer = json.choices[0]?.message.content || "";

      console.log("store assistant answer in brain:", assistant_answer);

      const proc_assistant_answer = assistant_answer.substring(
        assistant_answer.indexOf("{"),
        assistant_answer.lastIndexOf("}") + 1,
      );

      console.log(proc_assistant_answer);

      const new_data = JSON.parse(proc_assistant_answer);

      data.brainKG = [...data.brainKG, ...new_data.data];
    },
    async submitPrompt(data: Data) {
      const first_hist = {
        role: "system",
        content: `
        You are a helpful assistant. You have been provided with the following knowledge graph ${JSON.stringify({ data: data.brainKG })}.
        Use this knowledge graph and your own knowledge to answer questions. `,
      };

      data.modelStatus = "PROCESSING";
      const { hist, prompt } = data;

      const u_step = hist.length;
      const a_step = hist.length + 1;

      const user_prompt = {
        role: "user",
        content: prompt,
      };

      hist.push({
        step: u_step,
        convert_content: Dompurify.sanitize(await parse(prompt)),
        ...user_prompt,
      });

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

      await this.buildMemory!(data);

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
