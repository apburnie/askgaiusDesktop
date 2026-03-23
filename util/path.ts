import { LLAMA_CPP_VERSION } from "../constant";
import type { OSType } from "../type";

export function get_default_os_and_hardware(): {
  os: OSType;
} {
  const platform =
    window.navigator?.userAgentData?.platform || window.navigator.platform;

  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];

  let os: OSType = "unsupported";

  if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "WINDOWS";
  } else if (/Linux/.test(platform)) {
    os = "UBUNTU";
  }

  return { os };
}

export function compToModelPath({ os }: { os: OSType }): string | null {
  if (os === "unsupported") {
    return null;
  }

  let path = `llama-cpp/${LLAMA_CPP_VERSION}/${os}/`;
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
