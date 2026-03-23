import { type Data, type ModelStatusType } from "../type";
import { SERVER_PORT } from "../constant";
import { get_OS_and_hardware } from "./path";

export async function killServer() {
  await fetch("/kill-server", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function startServer(data: Data) {
  if (data.page === "CONVERSE" && data.modelStatus === "UNLOADED") {
    const { os, hardware } = await get_OS_and_hardware();

    console.log("OS", os);
    console.log("hardware", hardware);

    await fetch("/start-server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ os, hardware }),
    });

    console.log("SERVER STARTED");
  }
}
export async function pollServer(data: Data) {
  if (data.page === "CONVERSE" && data.modelStatus === "UNLOADED") {
    const refreshID = setInterval(async () => {
      console.log("check health");
      try {
        const resp = await fetch(`http://localhost:${SERVER_PORT}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = (await resp.json()) as { status: "ok" };

        if (json?.status === "ok") {
          data.modelStatus = "LOADED";
          sessionStorage.setItem("modelStatus", "LOADED");
          clearInterval(refreshID);
        }
      } catch {
        console.error("No server yet");
      }
    }, 1000);
  }
}
