import Alpine from "alpinejs";

import { Home, Converse } from "./component/page";

type PageType = "HOME" | "CONVERSE";
type HistType = { step: number; role: string; content: string }[];

interface Data {
  page: PageType;
  headerText: string;
  prompt: string;
  main: string;
  func_s: Record<string, Function>;
  hist: HistType;
  os: string;
  hardware: string;
}

const main = `${Home()}${Converse()}`;

const data: () => Data = () => ({
  page: "HOME",
  hist: [],
  headerText: "Welcome to Ask Gaius",
  prompt: "",
  os: "UBUNTU",
  hardware: "vulkan",
  main,
  func_s: {
    submitPrompt(data: Data) {
      const { hist, prompt } = data;
      const u_step = hist.length;
      const a_step = hist.length + 1;
      hist.push({ step: u_step, role: "user", content: prompt });

      hist.push({ step: a_step, role: "assistant", content: "hello" });
      data.prompt = "";
    },
    async startServer(data: Data) {
      await fetch("/start-server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ os: data.os, hardware: data.hardware }),
      });
    },
  },
});

Alpine.data("data", data);

Alpine.start();
