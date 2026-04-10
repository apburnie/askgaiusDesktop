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
  parseHTML,
  printHist,
  downloadBackup,
  clearSpecialMode,
  parseSemper,
} from "./util";
import { DEFAULT_DATA } from "./constant";

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
  errorMessage: null,
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
    parseHTML,
    parseSemper,
    activateGoldfish,
    activateWebSearch,
    goToHomePage,
    downloadBackup,
    clearSpecialMode,
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
