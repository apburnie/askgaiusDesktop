import { $ } from "bun";
import Page from "./index.html";

const LLAMA_CPP_VERSION = "b8352";
const MODEL = "Qwen3.5-9B-Q4_K_M.gguf";

function compToModelPath({ os, hardware }: { os: string; hardware: string }) {
  console.log(import.meta.dir);
  let path = `llama-cpp/${LLAMA_CPP_VERSION}/${os}/`;
  const LLAMA_STEM = `llama-${LLAMA_CPP_VERSION}`;
  const MAC_STEM = "-bin-macos-";
  const UBUNTU_STEM = "-bin-ubuntu-";
  const WINDOWS_STEM = "-bin-win-";

  if (os === "MACOS") {
    path += "MACOS/";
    if (hardware === "arm64") {
      path += LLAMA_STEM + MAC_STEM + "arm64/" + LLAMA_STEM;
    }
    if (hardware === "x64") {
      path += LLAMA_STEM + MAC_STEM + "x64/" + LLAMA_STEM;
    }
  }

  if (os === "UBUNTU") {
    if (hardware === "x64") {
      path += LLAMA_STEM + UBUNTU_STEM + "x64/" + LLAMA_STEM;
    }
    if (hardware === "vulkan") {
      path += LLAMA_STEM + UBUNTU_STEM + "vulkan-x64/" + LLAMA_STEM;
    }
    if (hardware === "s390x") {
      path += LLAMA_STEM + UBUNTU_STEM + "s390x/" + LLAMA_STEM;
    }
    if (hardware === "rocm") {
      path += LLAMA_STEM + UBUNTU_STEM + "rocm-7.2-x64/" + LLAMA_STEM;
    }
    if (hardware === "openvino") {
      path += LLAMA_STEM + UBUNTU_STEM + "openvino-2026.0-x64/" + LLAMA_STEM;
    }
  }

  if (os === "WINDOWS") {
    if (hardware === "vulkan") {
      path += LLAMA_STEM + WINDOWS_STEM + "vulkan-x64";
    }
    if (hardware === "sycl") {
      path += LLAMA_STEM + WINDOWS_STEM + "sycl-x64";
    }
    if (hardware === "hip") {
      path += LLAMA_STEM + WINDOWS_STEM + "hip-radeon-x64";
    }
    if (hardware === "cuda13") {
      path += LLAMA_STEM + WINDOWS_STEM + "cuda-13.1-x64";
    }
    if (hardware === "cuda12") {
      path += LLAMA_STEM + WINDOWS_STEM + "cuda-12.4-x64";
    }
    if (hardware === "cpuX64") {
      path += LLAMA_STEM + WINDOWS_STEM + "cpu-x64";
    }
    if (hardware === "cpuARM64") {
      path += LLAMA_STEM + WINDOWS_STEM + "cpu-arm64";
    }
  }

  return path;
}

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": Page,
    "/start-server": async (req) => {
      const body = await req.json();

      const { os, hardware } = body as { os: string; hardware: string };
      const path = compToModelPath({ os, hardware });

      await $`./${path}/llama-server -m ./model/${MODEL}`;

      return new Response("success");
    },
    "/console-test": async (req) => {
      const value = await $`echo hello from bun`.text();

      return new Response(value);
    },
  },
});

console.log(`Listening on ${server.url}`);

await $`open http://localhost:3000`;
