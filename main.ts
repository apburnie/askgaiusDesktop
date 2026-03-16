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
}

const main = `${Home()}${Converse()}`;

const data: () => Data = () => ({
  page: "HOME",
  hist: [],
  headerText: "Welcome to Ask Gaius",
  prompt: "",
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
  },
});

Alpine.data("data", data);

Alpine.start();
