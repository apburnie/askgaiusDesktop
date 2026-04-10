import { type Data, type SaveDataSet, type StoredSaveDataItem } from "../type";
import { loadConversation_s, saveConversation } from "./remember";

export async function parseSemper(file: File, data: Data) {
  const textContent = await file.text();
  const jsonContent = JSON.parse(textContent);
  await uploadBackup(jsonContent, data);
  await loadConversation_s(data);
}

async function uploadBackup(semper: SaveDataSet, data: Data) {
  const new_conversationS = semper.conversationS;

  let currentID = 0;
  const id_s = data.loadMeta.map(({ id }) => id);
  if (id_s.length > 0) {
    const latestID: number = Math.max(...id_s);
    currentID = latestID + 1;
  }

  for (const conv of new_conversationS) {
    console.log("saved text", conv.headerText);
    console.log("saved id", currentID);
    const item = { currentID, ...conv };
    await saveConversation(item);
    currentID++;
  }
}

export async function downloadSemper(data: Data) {
  const id_s = data.loadMeta.map(({ id }) => id);
  const latestID: number = Math.max(...id_s);

  const conversationS: StoredSaveDataItem[] = [];

  for (const id of id_s) {
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

    conversationS.push(foundData);
  }

  const semper: SaveDataSet = {
    latestID,
    conversationS,
  };

  const metaStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(semper));

  const aElement = document.createElement("a");

  aElement.setAttribute("href", metaStr);
  aElement.setAttribute("download", "semper");

  document.body.appendChild(aElement);
  aElement.click();

  aElement.remove();
}
