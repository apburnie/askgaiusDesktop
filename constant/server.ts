let mimirPath = "";
let minervaPath = "";
if (process) {
  if (process.env.MODE === "dev") {
    mimirPath = "./AskGaius/.e/semper";
    minervaPath = "./AskGaius/.e/minerva";
  } else {
    // Production mode
    mimirPath = "../semper";
    minervaPath = "../minerva";
  }
}
export const MIMIR_PATH = mimirPath;
export const MINERVA_PATH = minervaPath;
