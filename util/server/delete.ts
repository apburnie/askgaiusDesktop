import type { SaveDataSet } from "../../type";
import { loadData } from "./load";

export async function deleteDataAPI(req: Bun.BunRequest) {
  console.log("saving data");
  const reqJSON = (await req.json()) as { id: number };

  const oldData = await loadData();

  if (!oldData) return new Response(JSON.stringify({ status: "fail" }));

  const newData: SaveDataSet = {
    latestID: oldData.latestID,
    conversationS: oldData.conversationS.filter(({ id }) => id !== reqJSON.id),
  };

  await Bun.write("./brain/interact/interact.json", JSON.stringify(newData));
  return new Response(JSON.stringify({ status: "success" }));
}
