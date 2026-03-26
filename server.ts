import { $ } from "bun";
import Page from "./index.html";
import { UI_PORT } from "./constant";
import { deleteDataAPI, loadDataAPI, saveDataAPI } from "./util/server";
import { loadClosestSummary } from "./util/server/memory";

import { parseArgs } from "util";

const server = Bun.serve({
  port: UI_PORT,
  routes: {
    "/": Page,
    "/save-data": saveDataAPI,
    "/load-data": loadDataAPI,
    "/delete-data": deleteDataAPI,
    "/load-closest": loadClosestSummary,
    "/model-path": async () => {
      const path = values.modelPath;
      return new Response(JSON.stringify({ path }));
    },
    "/model/*": (req) => {
      const filePath = "./public/" + new URL(req.url).pathname;
      const file = Bun.file(filePath);
      return new Response(file);
    },
  },
});

await $`open http://localhost:${UI_PORT}`;
