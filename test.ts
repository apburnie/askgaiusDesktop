import { pipeline, env } from "@huggingface/transformers";

env.localModelPath = "./model";
env.allowRemoteModels = false;

console.log("does things");

// Create a text generation pipeline
const generator = await pipeline(
  "text-generation",
  "onnx-community/Qwen2.5-0.5B-Instruct",
  { dtype: "q4", device: "webgpu" },
);

// Define the list of messages
const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Tell me a funny joke." },
];

// Generate a response
const output = await generator(messages, { max_new_tokens: 128 });
console.log(output[0].generated_text.at(-1).content);

import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
  RawImage,
  TextStreamer,
} from "@huggingface/transformers";

const model_id = "onnx-community/Qwen3.5-0.8B-ONNX";
const processor = await AutoProcessor.from_pretrained(model_id);
const model = await Qwen3_5ForConditionalGeneration.from_pretrained(model_id, {
  dtype: {
    embed_tokens: "q4",
    vision_encoder: "fp16",
    decoder_model_merged: "q4",
  },
  device: "webgpu",
});

// Prepare inputs
const url =
  "https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen-VL/assets/demo.jpeg";
const image = await (await RawImage.read(url)).resize(448, 448);
const conversation = [
  {
    role: "user",
    content: [
      { type: "image" },
      { type: "text", text: "Describe this image." },
    ],
  },
];
const text = processor.apply_chat_template(conversation, {
  add_generation_prompt: true,
});
const inputs = await processor(text, image);

const outputs = await model.generate({
  ...inputs,
  max_new_tokens: 512,
  streamer: new TextStreamer(processor.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: false,
  }),
});

// Decode output
const decoded = processor.batch_decode(
  outputs.slice(null, [inputs.input_ids.dims.at(-1), null]),
  {
    skip_special_tokens: true,
  },
);
console.log(decoded[0]);
