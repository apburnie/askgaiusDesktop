import { expect, test } from "bun:test";
import {
  word_s_to_word_count_s,
  sent_to_word_s,
  para_to_sent_s,
  word_count_s_to_doc_count_s,
  getValueOrZero,
} from "../util/tf_idf";

const TEST_SENTENCE = `This is a test sentence, which is great to see.
  This sentence has a reference at the end.[a] This sentence has numbers 0.1231 0.a. This is end sentence`;

test("paragraphs to sentences", () => {
  const test_ans = [
    "This is a test sentence, which is great to see",
    "This sentence has a reference at the end",
    "[a] This sentence has numbers 0.1231 0.a",
    "This is end sentence",
  ];

  const sent_s = para_to_sent_s(TEST_SENTENCE);

  sent_s.forEach((sent, i) => {
    expect(sent).toMatch(test_ans[i]!);
  });
});

test("sentence to words", () => {
  const sentence = "a b 0.1 b bc, b: a b";

  const test_ans = ["a", "b", "0.1", "b", "bc", "b", "a", "b"];

  const word_s = sent_to_word_s(sentence);

  test_ans.forEach((ans, i) => {
    expect(ans).toMatch(word_s[i]!);
  });
});

test("words to term frequencies", () => {
  const test_ans = { a: 2, b: 4, "0.1": 1, bc: 1 };
  const sentence = "a b 0.1 b bc, b: a b";

  const tf_s = word_s_to_word_count_s(sent_to_word_s(sentence));

  console.log("FOUND", tf_s);
  console.log("EXPECT", test_ans);

  Object.keys(test_ans).forEach((sent, i) => {
    expect(tf_s[sent]).toBe(test_ans[sent]!);
  });
});

test("sentences to document frequencies", () => {
  const sent_s = [
    "this is a test sentence, which is great to see",
    "this sentence has a reference at the end",
    "this sentence has numbers 0.1231 0.a",
    "this is end",
  ];

  const test_ans = {
    this: 4,
    is: 2,
    a: 2,
    test: 1,
    sentence: 3,
    which: 1,
    great: 1,
    to: 1,
    see: 1,
    has: 2,
    reference: 1,
    at: 1,
    the: 1,
    end: 2,
    numbers: 1,
    "0.1231": 1,
    "0.a": 1,
  };

  const df_s = word_count_s_to_doc_count_s(
    sent_s.map((sent) => word_s_to_word_count_s(sent_to_word_s(sent))),
  );

  Object.keys(test_ans).forEach((sent, i) => {
    expect(df_s[sent]).toBe(test_ans[sent]!);
  });
});

test("get value", () => {
  expect(getValueOrZero({ a: 0 }, "a")).toBe(0);
  expect(getValueOrZero({ a: 0 }, "b")).toBe(0);
  expect(getValueOrZero({ a: 1 }, "a")).toBe(1);
});
