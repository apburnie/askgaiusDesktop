import type { TFIDFType } from "../../type";
import { cosineSimilarity } from "../tf_idf";
import { loadAll } from "./load";

export async function loadClosestSummary(internal_brain: {
  id: number | null;
  tfidf: TFIDFType;
}): Promise<{ closestExternal: string }> {
  const brain = await loadAll();

  if (brain.length === 0) {
    return { closestExternal: "" };
  }

  let max_cs = -100;
  let max_index = 0;

  for (let i = 0; i < brain.length; i++) {
    const { id, tfidf } = brain[i]!;

    if (id === internal_brain.id) {
      continue;
    }

    const cs = cosineSimilarity(internal_brain.tfidf, tfidf);

    if (cs > max_cs) {
      max_cs = cs;
      max_index = i;
    }
  }
  let closestExternal;
  if (max_cs <= 0) {
    closestExternal = "";
  } else {
    closestExternal = brain[max_index]?.brain || "";
  }

  return { closestExternal };
}
