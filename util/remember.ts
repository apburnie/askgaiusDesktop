import {
  type ConversationSummary,
  type Data,
  type SaveDataSet,
  type SentSaveDataItem,
  type StoredSaveDataItem,
  type TFIDFType,
} from "../type";
import { doc_TFIDF } from "./tf_idf";

export async function buildMemory(data: Data) {
  const text = data.hist.map(({ content }) => content).join(" ");

  const tfidf = doc_TFIDF(text);
  data.brain = tfidf.getSummary(10) ?? "";
  data.headerText = tfidf.getSummary(1) ?? "";
  data.tfidf = tfidf.docTFIDF;

  if (data.brain === "") {
    console.error(
      "Something went wrong with summary - it is not related to itself",
    );
  }
}

export async function parseSemper(file: File, data: Data) {
  const textContent = await file.text();
  const jsonContent = JSON.parse(textContent);
  await saveConversation(jsonContent);
  await loadConversation_s(data);
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

  const saveResp = await fetch("/api/save-data", {
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
  const saveResp = await fetch("/api/delete-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: searchID }),
  });

  const loadJSON = (await saveResp.json()) as { status: string };

  await loadConversation_s(data);

  if (loadJSON.status === "success") {
    data.page = "HOME";
  }
}

export async function loadConversation_s(data: Data) {
  const saveResp = await fetch("/api/load-data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const loadJSON = (await saveResp.json()) as { data: ConversationSummary[] };

  const latestFirst: ConversationSummary[] = [];

  loadJSON.data.forEach((saveItem) => {
    latestFirst.unshift(saveItem);
  });

  data.loadMeta = latestFirst;
}

export async function downloadBackup(): Promise<null | SaveDataSet> {
  const backupResp = await fetch("/api/load-backup", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const loadJSON = (await backupResp.json()) as { data: null | SaveDataSet };

  const metaStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(loadJSON.data));

  const aElement = document.createElement("a");

  aElement.setAttribute("href", metaStr);
  aElement.setAttribute("download", "semper");

  document.body.appendChild(aElement);
  aElement.click();

  aElement.remove();
}

export async function loadByID(
  searchID: number,
  conversationS: StoredSaveDataItem[],
): Promise<StoredSaveDataItem | null> {
  return conversationS.find(({ id }) => id === searchID) ?? null;
}

export async function switchForID(id: number, data: Data) {
  const resp = await fetch("/api/load-data-id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ findID: id }),
  });

  const respJSON = await resp.json();

  const { data: foundData } = respJSON as {
    data: StoredSaveDataItem;
  };

  data.currentID = foundData.id;
  data.hist = foundData.hist;
  data.headerText = foundData.headerText;
  data.brain = foundData.brain;
  data.tfidf = foundData.tfidf;
  data.page = "CONVERSE";
}

export function startNewSession(data: Data) {
  data.hist = [];
  data.currentID = null;
  data.headerText = "";
  data.brain = "";
  data.tfidf = {};

  data.page = "CONVERSE";
}

export async function getClosestSummary({
  id,
  tfidf,
}: {
  id: number | null;
  tfidf: TFIDFType;
}) {
  const resp = await fetch("/api/load-closest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, tfidf }),
  });

  const respJSON = await resp.json();

  const { closestExternal } = respJSON as {
    closestExternal: string;
  };

  return closestExternal;
}
