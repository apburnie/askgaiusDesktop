import { stemmer } from "stemmer";

export function para_to_sent_s(
  para: string,
  min_string_len: boolean,
): string[] {
  const re = new RegExp(`[\.|!|?](?![0-9|a-z|A-Z])`, "g");

  let proc = para.split(re).map((sent) => sent.trim());

  if (min_string_len) {
    proc = proc.filter((a) => a.length > 50);
  }

  return proc;
}

export function sent_to_word_s(sent: string): string[] {
  return sent.split(/[^a-zA-Z0-9\.]+/g);
}

export function word_s_to_word_count_s(
  word_s: string[],
): Record<string, number> {
  const initial = new Map();

  word_s.forEach((current) => {
    const prev = initial.get(current);

    if (prev === undefined) {
      initial.set(current, 1);
    } else {
      initial.set(current, prev + 1);
    }
  });

  return Object.fromEntries(initial);
}

export function word_count_s_to_doc_count_s(
  tf_s: Record<string, number>[],
): Record<string, number> {
  const initial = new Map();

  for (const tf of tf_s) {
    Object.keys(tf).forEach((word) => {
      const prev = initial.get(word);

      if (prev === undefined) {
        initial.set(word, 1);
      } else {
        initial.set(word, prev + 1);
      }
    });
  }

  return Object.fromEntries(initial);
}

export function getValueOrZero(obj: Object, key: string): number {
  return obj?.[key] ?? 0;
}

export function cosineSimilarity(
  vecA: Record<string, number>,
  vecB: Record<string, number>,
) {
  let dotProduct = 0,
    magA = 0,
    magB = 0;

  let allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  allWords.forEach((word) => {
    let a = getValueOrZero(vecA, word);
    let b = getValueOrZero(vecB, word);

    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  });

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function sent_to_tf_wordCount_s(sent_s: string[]): {
  text: string;
  wordToCount: Record<string, number>;
  tf: Record<string, number>;
}[] {
  return sent_s.map((sent) => {
    const word_s = sent_to_word_s(sent);
    const stem_s = word_s.map((word) => stemmer(word));

    const wordToCount = word_s_to_word_count_s(stem_s);
    const totalWord = stem_s.length;

    const tf = Object.fromEntries(
      Object.entries(wordToCount).map(([stem, count]) => [
        stem,
        count / (count + 1.2 * (1 - 0.75 + (0.75 * totalWord) / 20)),
      ]),
    );

    return {
      text: sent,
      wordToCount,
      tf,
    };
  });
}

function doc_count_s_to_idf_s(
  doc_word_count: Record<string, number>,
  no_of_doc: number,
) {
  const idf = Object.fromEntries(
    Object.entries(doc_word_count).map(([stem, count]) => [
      stem,
      Math.log((no_of_doc - count + 0.5) / (count + 0.5) + 1),
    ]),
  );

  return idf;
}

export function findClosestStringToQuery(query: string, text: string) {
  const { sent_tf_idf_s } = calcSentTFIDF_n_docIDF_s(text, false, query);

  const queryTFIDF = sent_tf_idf_s.find(({ text }) => text.includes(query))!;
  const excl_sent_tfidf_s = sent_tf_idf_s.filter(
    ({ text }) => !text.includes(query),
  );

  const getSummary = calcClosest({
    sent_tf_idf_s: excl_sent_tfidf_s,
    comparison: queryTFIDF.tfidf,
  });

  return {
    getSummary,
  };
}

function calcSentTFIDF_n_docIDF_s(
  text: string,
  min_string_len: boolean,
  isol_text?: string,
) {
  // Break text up into sentences
  let sent_s = para_to_sent_s(text, min_string_len);

  if (isol_text) {
    sent_s.unshift(isol_text);
  }

  // Each sentence is unique
  sent_s = Array.from(new Set(sent_s));

  const no_of_doc = sent_s.length;

  // For each sentence get tf and word count
  const sent_tf_wordCount_s = sent_to_tf_wordCount_s(sent_s);
  const doc_word_count = word_count_s_to_doc_count_s(
    sent_tf_wordCount_s.map(({ wordToCount }) => wordToCount),
  );

  const doc_idf = doc_count_s_to_idf_s(doc_word_count, no_of_doc);

  const sent_tf_idf_s = sent_tf_wordCount_s.map(({ tf, text }) => {
    const tfidf = Object.fromEntries(
      Object.entries(tf).map(([stem, word_tf]) => {
        return [stem, word_tf - doc_idf[stem]!];
      }),
    );

    return { tfidf, text };
  });

  return { sent_tf_idf_s, doc_idf };
}

function calcDocAveTFIDF(sent_tf_idf_s: { tfidf: Record<string, number> }[]) {
  const doc_baseline: Record<string, number> = {};

  sent_tf_idf_s.forEach(({ tfidf }) =>
    Object.entries(tfidf).map(([stem, tfidf]) => {
      if (Object.keys(doc_baseline).includes(stem)) {
        doc_baseline[stem]! += tfidf;
      } else {
        doc_baseline[stem] = tfidf;
      }
    }),
  );

  return doc_baseline;
}

function calcClosest({
  sent_tf_idf_s,
  comparison,
}: {
  sent_tf_idf_s: { tfidf: Record<string, number>; text: string }[];
  comparison: Record<string, number>;
}) {
  const sent_score_s = sent_tf_idf_s.map(({ text, tfidf }) => {
    const score = cosineSimilarity(tfidf, comparison);

    return {
      text,
      score,
    };
  });

  function getSummary(numSentence: number) {
    return sent_score_s
      .sort((a, b) => b.score - a.score)
      .slice(0, numSentence)
      .map((entry) => entry.text)
      .join(". ");
  }

  return getSummary;
}

export function doc_TFIDF(text: string): {
  getSummary: (value: number) => string;
  docTFIDF: Record<string, number>;
} {
  const { sent_tf_idf_s } = calcSentTFIDF_n_docIDF_s(text, true);

  const doc_baseline = calcDocAveTFIDF(sent_tf_idf_s);

  const getSummary = calcClosest({ sent_tf_idf_s, comparison: doc_baseline });

  return {
    getSummary,
    docTFIDF: doc_baseline,
  };
}
