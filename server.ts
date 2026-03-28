import Page from "./index.html";
import { UI_PORT } from "./constant";
import { deleteDataAPI, loadDataAPI, saveDataAPI } from "./util/server";
import { loadClosestSummary } from "./util/server/memory";

const server = Bun.serve({
  port: UI_PORT,
  routes: {
    "/": Page,
    "/save-data": saveDataAPI,
    "/load-data": loadDataAPI,
    "/delete-data": deleteDataAPI,
    "/load-closest": loadClosestSummary,
    "/model/*": (req) => {
      const filePath = "./public/" + new URL(req.url).pathname;
      const file = Bun.file(filePath);
      return new Response(file);
    },
  },
});

console.log("Please open your browser at http://localhost:2000");
