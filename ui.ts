import Alpine from "alpinejs";

import { Home, Converse, Continue, Delete } from "./component/page";

import { type Data } from "./type";
import {
  activatePromptTrainer,
  buildMemory,
  deleteByID,
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
  },
});

Alpine.data("data", data);

Alpine.start();
