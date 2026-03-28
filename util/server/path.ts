import { type OSType } from "../../type";
export const LLAMA_CPP_VERSION = "b8352";

export function compToModelPath({ os }: { os: OSType }): string | null {
  if (os === "unsupported") {
    return null;
  }

  let path = `llama-cpp/`;
  const LLAMA_STEM = `llama-${LLAMA_CPP_VERSION}`;
  const UBUNTU_STEM = "-bin-ubuntu-";
  const WINDOWS_STEM = "-bin-win-";

  if (os === "UBUNTU") {
    path += LLAMA_STEM + UBUNTU_STEM + "vulkan-x64/" + LLAMA_STEM;
  }

  if (os === "WINDOWS") {
    path += LLAMA_STEM + WINDOWS_STEM + "vulkan-x64";
  }

  return path;
}
