let mimirPath = "";
if (process) {
  if (process.env.MODE === "dev") {
    mimirPath = "./output/mimir/mimir.json";
  } else {
    // Production mode
    mimirPath = "../mimir/mimir.json";
  }
}
export const MIMIR_PATH = mimirPath;
