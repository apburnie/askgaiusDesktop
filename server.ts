import express from "express";
import path from "node:path";
const app = express();
const port = 8080;
app.use("/", express.static(path.join(__dirname, "output")));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
