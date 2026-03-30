export type PageType = "HOME" | "CONVERSE" | "CONTINUE" | "DELETE";
export type ModelStatusType = "UNLOADED" | "LOADED" | "PROCESSING";
export type SystemPromptModeType =
  | "BASE"
  | "PROMPT_TRAINER"
  | "GOLDFISH"
  | "WEBSEARCH";
export type ConverseSubPageType = "CONVERSE" | "SETTING";
export type OSType = "UBUNTU" | "WINDOWS" | "unsupported";

export type TFIDFType = Record<string, number>;

export type Message = {
  role: string;
  content: string;
};

interface OneHist extends Message {
  step: number;
  convert_content: string;
  convert_thought: string;
}

export type HistType = OneHist[];
export type MessageS = Message[];

export interface ConversationData {
  currentID: null | number;
  headerText: string;
  hist: HistType;
  brain: string;
  tfidf: TFIDFType;
}

interface UIData {
  page: PageType;
  modelStatus: ModelStatusType;
  main: string;
  prompt: string;
  systemPromptMode: SystemPromptModeType;
  converseSubPage: ConverseSubPageType;
  runAns: string | null;
  killStream: boolean;
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
  tfidf: TFIDFType;
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
