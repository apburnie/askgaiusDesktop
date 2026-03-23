import Alpine from "alpinejs";

import { Home, Converse, Continue, Delete } from "./component/page";

import { type Data } from "./type";
import {
  activatePromptTrainer,
  buildMemory,
  deleteByID,
  loadConversation_s,
  pollServer,
  saveConversation,
  startNewSession,
  startServer,
  submitPrompt,
  switchForID,
} from "./util";
import { DEFAULT_DATA } from "./constant";

const main = `${Home()}${Continue()}${Delete()}${Converse()}`;

const data: () => Data = () => ({
  ...DEFAULT_DATA,
  page: "HOME",
  modelStatus: "UNLOADED",
  main,
  prompt: "",
  systemPromptMode: "BASE",
  converseSubPage: "CONVERSE",
  loadMeta: [],
  func_s: {
    startServer,
    pollServer,
    buildMemory,
    saveConversation,
    activatePromptTrainer,
    submitPrompt,
    loadConversation_s,
    switchForID,
    startNewSession,
    deleteByID,
  },
});

Alpine.data("data", data);

Alpine.start();
