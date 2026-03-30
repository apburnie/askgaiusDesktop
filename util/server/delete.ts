import { MIMIR_PATH } from "../../constant";

import type { SaveDataSet } from "../../type";
import { loadData } from "./load";

export async function deleteDataAPI(reqJSON: { id: number }) {
  console.log("saving data");

  const oldData = await loadData();

  if (!oldData) return new Response(JSON.stringify({ status: "fail" }));

  const newData: SaveDataSet = {
    latestID: oldData.latestID,
    conversationS: oldData.conversationS.filter(({ id }) => id !== reqJSON.id),
  };

  await Bun.write(MIMIR_PATH, JSON.stringify(newData));
  return { status: "success" };
}
