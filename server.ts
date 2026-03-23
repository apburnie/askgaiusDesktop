import { $ } from "bun";
import Page from "./index.html";
import { MODEL, UI_PORT, SERVER_PORT } from "./constant";
import { convert_os_and_hardware_to_model_path } from "./util";
import { deleteDataAPI, loadDataAPI, saveDataAPI } from "./util/server";
import { createCompSpecAPI, getCompSpecAPI } from "./util/server/changeSpec";

let p_process: ReturnType<Bun.spawn>;

const server = Bun.serve({
  port: UI_PORT,
  routes: {
    "/": Page,
    "/start-server": async (req) => {
      const body = await req.json();

      const { os, hardware } = body as { os: string; hardware: string };
      const path = convert_os_and_hardware_to_model_path({ os, hardware });

      p_process = Bun.spawnSync([
        `./${path}/llama-server`,
        "-m",
        `./model/${MODEL}`,
        "--port",
        `${SERVER_PORT}`,
        //"--no-webui",
        "--reasoning-budget",
        `${0}`,
      ]);

      return new Response("success");
    },
    "/kill-server": async () => {
      p_process?.kill();
      return new Response("success");
    },
    "/save-data": saveDataAPI,
    "/load-data": loadDataAPI,
    "/delete-data": deleteDataAPI,
    "/create-compspec": createCompSpecAPI,
    "/get-compspec": getCompSpecAPI,
  },
});

console.log(`Listening on ${server.url}`);

await $`open http://localhost:${UI_PORT}`;
