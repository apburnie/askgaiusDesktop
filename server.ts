import express from "express";
import {
  getArticleFromWikipediaAPI,
  loadClosestSummary,
  deleteDataAPI,
  loadDataAPI,
  saveDataAPI,
  isAuthorized,
  loadBackupAPI,
} from "./util/server";

isAuthorized().then((IS_AUTH) => {
  if (process.env.MODE === "dev" || IS_AUTH) {
    const app = express();
    const port = 8080;

    if (process.env.MODE === "dev") {
      app.use("/", express.static("./output/minerva"));
    } else {
      // Production mode
      app.use("/", express.static("../minerva"));
    }

    app.use("/api", express.json({ limit: "50mb" }));

    app.post("/api/save-data", async (req, res) => {
      const { id } = await saveDataAPI(req.body);

      return res.json({ id });
    });

    app.get("/api/load-data", async (_, res) => {
      const data = await loadDataAPI();

      return res.json(data);
    });

    app.get("/api/load-backup", async (_, res) => {
      const data = await loadBackupAPI();

      return res.json({ data });
    });

    app.post("/api/delete-data", async (req, res) => {
      const respJSON = await deleteDataAPI(req.body);

      return res.json(respJSON);
    });

    app.post("/api/load-closest", async (req, res) => {
      const respJSON = await loadClosestSummary(req.body);
      return res.json(respJSON);
    });

    app.post("/api/ask-wikipedia", async (req, res) => {
      const respJSON = await getArticleFromWikipediaAPI(req.body);
      return res.json(respJSON);
    });

    app.listen(port, () => {
      console.log(`Open the browser at http://localhost:${port}`);
    });
  } else {
    console.error(
      "You are only permitted to run AskGaius on the storage medium it was provided on",
    );
  }
});
