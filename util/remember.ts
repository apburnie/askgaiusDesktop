import { DEFAULT_DATA } from "../constant";
import {
  type Data,
  type SentSaveDataItem,
  type StoredSaveDataItem,
} from "../type";
import { doc_TFIDF } from "./tf_idf";

export async function buildMemory(data: Data) {
  const text = data.hist.map(({ content }) => content).join(" ");

  const tfidf = doc_TFIDF(text);
  data.brain = tfidf.getSummary(10);
  data.headerText = tfidf.getSummary(1);
  data.tfidf = tfidf.docTFIDF;
}

export async function saveConversation(data: Data) {
  // Create Save Data
  const saveData: SentSaveDataItem = {
    currentID: data.currentID,
    hist: data.hist,
    headerText: data.headerText,
    brain: data.brain,
    tfidf: data.tfidf,
  };

  const saveResp = await fetch("/save-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(saveData),
  });

  const saveJSON = (await saveResp.json()) as { id: number | null };

  data.currentID = saveJSON.id;
}

export async function deleteByID(searchID: number, data: Data) {
  const saveResp = await fetch("/delete-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: searchID }),
  });

  const loadJSON = (await saveResp.json()) as { status: string };

  if (loadJSON.status === "success") {
    data.page = "HOME";
  }
}

export async function loadConversation_s(data: Data) {
  const saveResp = await fetch("/load-data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const loadJSON = (await saveResp.json()) as { data: StoredSaveDataItem[] };

  data.loadMeta = loadJSON.data;
}

export async function loadByID(
  searchID: number,
  conversationS: StoredSaveDataItem[],
): Promise<StoredSaveDataItem | null> {
  return conversationS.find(({ id }) => id === searchID) ?? null;
}

export async function switchForID(meta: StoredSaveDataItem, data: Data) {
  data.currentID = meta.id;
  data.hist = meta.hist;
  data.headerText = meta.headerText;
  data.brain = meta.brain;
  data.tfidf = meta.tfidf;
  data.page = "CONVERSE";
}

export function startNewSession(data: Data) {
  const key_s = Object.keys(DEFAULT_DATA);

  key_s.forEach((key) => {
    data[key] = DEFAULT_DATA[key];
  });
  data.page = "CONVERSE";
}
