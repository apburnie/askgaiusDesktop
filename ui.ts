import Alpine from "alpinejs";

import {
  Home,
  Converse,
  Continue,
  Delete,
  Welcome,
  Custom,
} from "./component/page";

import { type Data } from "./type";
import {
  activatePromptTrainer,
  buildMemory,
  change_hardware,
  change_os,
  deleteByID,
  getHardwareOpts,
  loadConversation_s,
  pollServer,
  revert_default_os_and_hardware,
  saveConversation,
  startNewSession,
  startServer,
  submitPrompt,
  switchForID,
} from "./util";
import { DEFAULT_DATA } from "./constant";

const main = `${Welcome()}${Custom()}${Home()}${Continue()}${Delete()}${Converse()}`;

const data: () => Data = () => ({
  ...DEFAULT_DATA,
  page: "WELCOME",
  modelStatus: "UNLOADED",
  main,
  prompt: "",
  systemPromptMode: "BASE",
  converseSubPage: "CONVERSE",
  os: "UBUNTU",
  hardware: "vulkan",
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
    getHardwareOpts,
    revert_default_os_and_hardware,
    change_os,
    change_hardware,
  },
});

Alpine.data("data", data);

Alpine.start();
