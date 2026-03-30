import express from "express";
import {
  getArticleFromWikipediaAPI,
  loadClosestSummary,
  deleteDataAPI,
  loadDataAPI,
  saveDataAPI,
} from "./util/server";
const app = express();
const port = 8080;
app.use("/", express.static("./output"));

app.use("/api", express.json());

app.post("/api/save-data", async (req, res) => {
  const { id } = await saveDataAPI(req.body);

  return res.json({ id });
});

app.get("/api/load-data", async (_, res) => {
  const data = await loadDataAPI();

  return res.json(data);
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
  console.log(`listening on port ${port}`);
});
