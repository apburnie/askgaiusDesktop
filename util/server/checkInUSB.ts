import { spawnSync } from "node:child_process";
import { platform } from "node:os";

function getHardwareSignature() {
  const os = platform();

  try {
    if (os === "linux") {
      // Get device path from current directory
      const df = spawnSync("df", ["--output=source", "."])
        .stdout.toString()
        .split("\n")[1]
        .trim();
      // Get UUID and Vendor info
      const info = spawnSync("lsblk", ["-no", "UUID,VENDOR", df])
        .stdout.toString()
        .trim();
      return info.replace(/\s+/g, "-");
    }

    if (os === "darwin") {
      // macOS: Extract Volume UUID and Media Name
      const df = spawnSync("df", ["."])
        .stdout.toString()
        .split("\n")[1]
        .split(/\s+/)[0];

      const info = spawnSync("diskutil", ["info", df]).stdout.toString();

      const uuid = info.match(/Volume UUID:\s+(.+)/)?.[1].trim();
      return uuid.replace(/\s+/g, "-");
    }

    if (os === "win32") {
      // Windows: Get Volume Serial Number
      const driveLetter = process.cwd().substring(0, 2);
      const info = spawnSync("cmd", [
        "/c",
        `vol ${driveLetter}`,
      ]).stdout.toString();
      const match = info.match(/Serial Number is (.+)/);
      return match[1].trim();
    }
  } catch (e) {
    return "error";
  }
}
export async function isAuthorized() {
  // Hardcoded signatures for your specific USB across platforms
  //
  // Hashed sigs
  const AUTHORIZED_SIGS = [
    "$argon2id$v=19$m=65536,t=2,p=1$X8QO+w/kzB1zVvrMaykQZh6ikVR8bfCgWrnLiXS1Rjo$hbDBzbcV2A//9hzxewlrKhkpmWsU4zBMz5YYf6Kud0g",
    "$argon2id$v=19$m=65536,t=2,p=1$HtRokATKAXTSfdyuCo8wxL/5/c5XofCcK2YFbCpZwCg$KZZYoz7Kkvp1s8whErKPqDHwU+V9jIPJcU8K6RAa964",
  ];

  const currentSig = getHardwareSignature();

  const chk1 = await Bun.password.verify(currentSig, AUTHORIZED_SIGS[0]);

  if (chk1) return true;

  const chk2 = await Bun.password.verify(currentSig, AUTHORIZED_SIGS[1]);

  if (chk2) return true;

  return false;
}
