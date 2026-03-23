import { $ } from "bun";
import Page from "./index.html";
import { MODEL, UI_PORT, SERVER_PORT } from "./constant";
import { compToModelPath } from "./util";
import { deleteDataAPI, loadDataAPI, saveDataAPI } from "./util/server";
import type { OSType } from "./type";

const server = Bun.serve({
  port: UI_PORT,
  routes: {
    "/": Page,
    "/start-server": async (req) => {
      const body = await req.json();

      const { os } = body as { os: OSType };

      const path = compToModelPath({ os });

      await $`./${path}/llama-server -m ./model/${MODEL} --port ${SERVER_PORT} --no-webui --reasoning-budget 0`;

      return new Response("success");
    },
    "/save-data": saveDataAPI,
    "/load-data": loadDataAPI,
    "/delete-data": deleteDataAPI,
  },
});

console.log(`Listening on ${server.url}`);

await $`open http://localhost:${UI_PORT}`;
