import { type Data } from "../type";
import { SERVER_PORT } from "../constant";

export async function startServer(data: Data) {
  if (data.page === "CONVERSE" && data.modelStatus === "UNLOADED") {
    await fetch("/start-server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ os: data.os, hardware: data.hardware }),
    });
  }
}
export async function pollServer(data: Data) {
  if (data.page === "CONVERSE") {
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
          clearInterval(refreshID);
        }
      } catch {
        console.error("No server yet");
      }
    }, 1000);
  }
}
