import { env, pipeline } from "@huggingface/transformers";

export async function submitPrompt() {
  env.localModelPath = `./model`;
  env.allowRemoteModels = false;
  env.allowLocalModels = true;

  const messages = [{ role: "user", content: "hello" }];

  console.log("create pipeline");

  const pipe = await pipeline(
    "text-generation",
    "onnx-community/Qwen3.5-4B-ONNX",
    {
      dtype: "q4",
      device: "cpu",
    },
  );

  console.log("use pipeline");
  const output = await pipe(messages, {
    max_new_tokens: 1024,
    temperature: 0.7,
    top_k: 20,
    top_p: 0.8,
    tokenizer_encode_kwargs: {
      enable_thinking: false,
    },
  });

  const full_content = output[0]?.generated_text!;

  console.log(full_content[full_content?.length - 1]?.content);
}

submitPrompt();
