import { $ } from "bun";
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
  },
});

console.log(`Listening on ${server.url}`);

await $`open http://localhost:${UI_PORT}`;
