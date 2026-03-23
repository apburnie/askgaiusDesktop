export type PageType = "HOME" | "CONVERSE" | "CONTINUE" | "DELETE";
export type ModelStatusType = "UNLOADED" | "LOADED" | "PROCESSING";
export type SystemPromptModeType = "BASE" | "PROMPT_TRAINER";
export type ConverseSubPageType = "CONVERSE" | "SETTING";
export type OSType = "UBUNTU" | "WINDOWS" | "unsupported";

export type HistType = {
  step: number;
  role: string;
  content: string;
  convert_content: string;
}[];

export interface ConversationData {
  currentID: null | number;
  headerText: string;
  hist: HistType;
  brain: string;
  tfidf: Record<string, number>;
}

interface UIData {
  page: PageType;
  modelStatus: ModelStatusType;
  main: string;
  prompt: string;
  systemPromptMode: SystemPromptModeType;
  converseSubPage: ConverseSubPageType;
}

interface CacheData {
  loadMeta: StoredSaveDataItem[];
}

interface FuncData {
  func_s: Record<string, Function>;
}

export type Data = FuncData & CacheData & UIData & ConversationData;

export interface SentSaveDataItem {
  currentID: null | number;
  hist: HistType;
  headerText: string;
  brain: string;
  tfidf: Record<string, number>;
}

export interface StoredSaveDataItem extends Omit<
  SentSaveDataItem,
  "currentID"
> {
  id: number;
  timeAtSave: number;
}

export interface SaveDataSet {
  latestID: number;
  conversationS: StoredSaveDataItem[];
}
