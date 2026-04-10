import { MIMIR_PATH } from "../../constant/server";
import type { SaveDataSet, StoredSaveDataItem } from "../../type";

export async function loadData(): Promise<false | SaveDataSet> {
  const file = Bun.file(MIMIR_PATH);
  const fileExists = await file.exists();

  if (fileExists) {
    return (await file.json()) as SaveDataSet;
  } else {
    return false;
  }
}

export async function loadAll(): Promise<StoredSaveDataItem[]> {
  const data = await loadData();

  if (data) {
    return data.conversationS;
  } else {
    return [];
  }
}

export async function loadMetaDataAPI() {
  const rest = await loadAll();

  // Just get meta

  const data = rest.map(({ id, timeAtSave, headerText }) => ({
    id,
    timeAtSave,
    headerText,
  }));

  return { data };
}

export async function loadConversationByIDAPI({ findID }: { findID: number }) {
  const rest = await loadAll();

  const foundConversation = rest.find(({ id }) => id === findID);

  return { data: foundConversation };
}

export async function loadBackupAPI(): Promise<null | SaveDataSet> {
  const data = await loadData();

  if (data) {
    return data;
  } else {
    return null;
  }
}
