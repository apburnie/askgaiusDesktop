import { type SaveDataSet, type SentSaveDataItem } from "../../type";
import { loadData } from "./load";

interface ProcessReturnResult {
  saveID: number;
  storedData: SaveDataSet;
}

function handleNoFileCase(saveData: SentSaveDataItem): ProcessReturnResult {
  return {
    saveID: 0,
    storedData: {
      latestID: 0,
      conversationS: [
        {
          id: 0,
          timeAtSave: Date.now(),
          hist: saveData.hist,
          headerText: saveData.headerText,
          brain: saveData.brain,
          tfidf: saveData.tfidf,
        },
      ],
    },
  };
}

function handleNewEntry(
  currentData: SaveDataSet,
  saveData: SentSaveDataItem,
): ProcessReturnResult {
  const saveID = currentData.latestID + 1;

  return {
    saveID,
    storedData: {
      latestID: saveID,
      conversationS: [
        ...currentData.conversationS,
        {
          id: saveID,
          timeAtSave: Date.now(),
          hist: saveData.hist,
          headerText: saveData.headerText,
          brain: saveData.brain,
          tfidf: saveData.tfidf,
        },
      ],
    },
  };
}

function handleUpdateEntry(
  currentData: SaveDataSet,
  saveData: SentSaveDataItem,
): ProcessReturnResult {
  return {
    saveID: saveData.currentID!,
    storedData: {
      latestID: currentData.latestID,
      conversationS: [
        ...currentData.conversationS.filter(
          ({ id }) => id !== saveData.currentID,
        ),
        {
          id: saveData.currentID!,
          timeAtSave: Date.now(),
          hist: saveData.hist,
          headerText: saveData.headerText,
          brain: saveData.brain,
          tfidf: saveData.tfidf,
        },
      ],
    },
  };
}

async function handleIsDataCase(
  currentData: SaveDataSet,
  saveData: SentSaveDataItem,
) {
  if (saveData.currentID === null) {
    return handleNewEntry(currentData, saveData);
  } else {
    return handleUpdateEntry(currentData, saveData);
  }
}

export async function saveDataAPI(req: Bun.BunRequest) {
  console.log("saving data");
  const saveData = (await req.json()) as SentSaveDataItem;

  let res: ProcessReturnResult;

  const oldData = await loadData();

  if (!oldData) {
    res = handleNoFileCase(saveData);
  } else {
    res = await handleIsDataCase(oldData, saveData);
  }

  await Bun.write(
    "./brain/interact/interact.json",
    JSON.stringify(res.storedData),
  );
  return new Response(JSON.stringify({ id: res.saveID }));
}
