import { platform } from "node:os";

async function runCommand(command: string[]): Promise<string> {
  const proc = Bun.spawn(command);
  const procOutput = await new Response(proc.stdout).text();
  return procOutput;
}

async function linuxCheck() {
  try {
    // Get device path from current directory
    const dfProc = await runCommand(["df", "--output=source", "."]);

    const df = dfProc.split("\n")[1]?.trim();

    if (df === undefined) return "ERROR";

    // Get UUID and Vendor info
    const lsblkProc = await runCommand(["lsblk", "-no", "UUID,VENDOR", df]);

    return lsblkProc.trim().replace(/\s+/g, "-");
  } catch (e) {
    return "ERROR";
  }
}

async function darwinCheck() {
  try {
    // macOS: Extract Volume UUID and Media Name
    const dfProc = await runCommand(["df", "."]);

    const lines = dfProc.split("\n");
    const df = lines[1]?.split(/s+/)[0];
    if (!df) return "ERROR";

    const info = await runCommand(["diskutil", "info", df]);

    const uuid = info.match(/Volume UUID:\s+(.+)/)?.[1]?.trim();
    return uuid ? uuid.replace(/\s+/g, "-") : "ERROR";
  } catch (e) {
    return "ERROR";
  }
}

async function windowsCheck() {
  try {
    // Windows: Get Volume Serial Number
    const driveLetter = process.cwd().substring(0, 2);
    const info = await runCommand(["cmd", "/c", `vol ${driveLetter}`]);

    const match = info.match(/Serial Number is (.+)/);
    return match?.[1] ? match[1].trim() : "ERROR";
  } catch (e) {
    return "ERROR";
  }
}

async function getHardwareSignature(): Promise<string> {
  const os = platform();

  try {
    if (os === "linux") {
      return await linuxCheck();
    }

    if (os === "darwin") {
      return await darwinCheck();
    }

    if (os === "win32") {
      return await windowsCheck();
    }
  } catch (e) {
    return "ERROR";
  }

  return "ERROR";
}
export async function isAuthorized() {
  // Hardcoded signatures for your specific USB across platforms
  //
  // Hashed sigs
  const AUTHORIZED_SIGS: [string, string] = [
    "66E1-5D6F",
    "CFCA7BC3-355C-33E4-B7CA-6F9F6096E1EE",
  ];

  const currentSig = await getHardwareSignature();

  const chk1 = currentSig === AUTHORIZED_SIGS[0];

  if (chk1) return true;

  const chk2 = currentSig === AUTHORIZED_SIGS[1];

  if (chk2) return true;

  return false;
}
