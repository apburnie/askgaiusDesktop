import { getDefaults } from "marked";
import { HARDWARE, LLAMA_CPP_VERSION } from "../constant";
import type { Data, HardwareType, OSType } from "../type";

export async function revert_default_os_and_hardware() {
  const { os, hardware } = get_default_os_and_hardware();
  await fetch("/create-compspec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ os, hardware }),
  });
}

export async function change_os(os: OSType) {
  let hardware;
  const existing = await get_comp_spec();

  if (existing.status === "NEW") {
    hardware = get_default_os_and_hardware()?.hardware;
  } else {
    hardware = existing.hardware;
  }
  await fetch("/create-compspec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ os, hardware }),
  });
}

export async function change_hardware(hardware: HardwareType) {
  let os;
  const existing = await get_comp_spec();

  if (existing.status === "NEW") {
    os = get_default_os_and_hardware()?.os;
  } else {
    os = existing.os;
  }

  await fetch("/create-compspec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ os, hardware }),
  });
}

export async function get_comp_spec() {
  const resp = await fetch("/get-compspec", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return await resp.json();
}

function get_default_os_and_hardware(): {
  os: OSType;
  hardware: HardwareType;
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

  return { os, hardware: "vulkan" };
}

export async function get_OS_and_hardware(): Promise<{
  os: OSType;
  hardware: HardwareType;
}> {
  let os, hardware;

  const resp = await get_comp_spec();

  if (resp.status === "NEW") {
    const spec = get_default_os_and_hardware();
    os = spec.os;
    hardware = spec.hardware;
  } else {
    const spec = resp as { os: OSType; hardware: HardwareType };

    os = spec.os;
    hardware = spec.hardware;
  }

  return { os, hardware };
}

export function convert_os_and_hardware_to_model_path({
  os,
  hardware,
}: {
  os: OSType;
  hardware: HardwareType;
}): string | null {
  let path = `llama-cpp/${LLAMA_CPP_VERSION}/${os}/`;
  const LLAMA_STEM = `llama-${LLAMA_CPP_VERSION}`;

  // In V1 Macos not supported
  /*
  const MAC_STEM = "-bin-macos-";
  if (os === "MACOS") {
    path += "MACOS/";
    if (hardware === "arm64") {
      path += LLAMA_STEM + MAC_STEM + "arm64/" + LLAMA_STEM;
    }
    if (hardware === "x64") {
      path += LLAMA_STEM + MAC_STEM + "x64/" + LLAMA_STEM;
    }
  }
  */

  const UBUNTU_STEM = "-bin-ubuntu-";
  if (os === "UBUNTU") {
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
    if (hardware === "x64") {
      path += LLAMA_STEM + UBUNTU_STEM + "x64/" + LLAMA_STEM;
    }
  }

  const WINDOWS_STEM = "-bin-win-";
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
    if (hardware === "x64") {
      path += LLAMA_STEM + WINDOWS_STEM + "cpu-x64";
    }
    if (hardware === "arm64") {
      path += LLAMA_STEM + WINDOWS_STEM + "cpu-arm64";
    }
  }

  return path;
}

export function getHardwareOpts(data: Data) {
  return HARDWARE[data.os];
}
