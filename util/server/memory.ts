import type { TFIDFType } from "../../type";
import { cosineSimilarity } from "../tf_idf";
import { loadAll } from "./load";

export async function loadClosestSummary(req: Bun.BunRequest) {
  const internal_brain = (await req.json()) as {
    id: number | null;
    tfidf: TFIDFType;
  };

  const brain = await loadAll();

  if (brain.length === 0) {
    return new Response(JSON.stringify({ closestExternal: "" }));
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

  const closestExternal = brain[max_index]?.brain;

  return new Response(JSON.stringify({ closestExternal }));
}
