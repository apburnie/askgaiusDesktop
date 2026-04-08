let mimirPath = "";
if (process) {
  if (process.env.MODE === "dev") {
    mimirPath = "./output/semper";
  } else {
    // Production mode
    mimirPath = "../semper";
  }
}
export const MIMIR_PATH = mimirPath;
