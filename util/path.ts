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
