export type PageType = "HOME" | "CONVERSE" | "CONTINUE";
export type ModelStatusType = "UNLOADED" | "LOADED" | "PROCESSING";
export type SystemPromptModeType = "BASE" | "PROMPT_TRAINER";
export type ConverseSubPageType = "CONVERSE" | "SETTING";
export type HistType = {
  step: number;
  role: string;
  content: string;
  convert_content: string;
}[];

export interface Data {
  currentID: null | number;
  page: PageType;
  headerText: string;
  prompt: string;
  main: string;
  func_s: Record<string, Function>;
  hist: HistType;
  os: string;
  hardware: string;
  modelStatus: ModelStatusType;
  brain: string;
  systemPromptMode: SystemPromptModeType;
  converseSubPage: ConverseSubPageType;
  tfidf: Record<string, number>;
  loadMeta: StoredSaveDataItem[];
}

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
