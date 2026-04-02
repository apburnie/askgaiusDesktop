import Alpine from "alpinejs";

import { Home, Converse, Continue, Delete } from "./component/page";

import { type Data } from "./type";
import {
  activateGoldfish,
  activatePromptTrainer,
  activateWebSearch,
  buildMemory,
  deleteByID,
  goToHomePage,
  loadConversation_s,
  saveConversation,
  startNewSession,
  submitPrompt,
  switchForID,
} from "./util";
import { DEFAULT_DATA } from "./constant";
import { parsePDF, printHist } from "./util/print";

const main = `${Home()}${Continue()}${Delete()}${Converse()}`;

const data: () => Data = () => ({
  ...DEFAULT_DATA,
  page: "HOME",
  modelStatus: "LOADED",
  main,
  prompt: "",
  systemPromptMode: "BASE",
  converseSubPage: "CONVERSE",
  loadMeta: [],
  runAns: null,
  killStream: false,
  processText: "Processing",
  func_s: {
    buildMemory,
    saveConversation,
    activatePromptTrainer,
    submitPrompt,
    loadConversation_s,
    switchForID,
    startNewSession,
    deleteByID,
    printHist,
    parsePDF,
    activateGoldfish,
    activateWebSearch,
    goToHomePage,
    getHeaderText: (data: Data, length: number) => {
      const text = data.headerText.replace(/[\s\n]+/g, " ");

      if (text.length > length) {
        return text.slice(0, length - 3) + "\u2026";
      } else {
        return text;
      }
    },
  },
});

Alpine.data("data", data);

Alpine.start();
