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

export async function loadDataAPI() {
  const rest = await loadAll();
  return { data: rest };
}
