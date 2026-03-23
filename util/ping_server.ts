import { type Data } from "../type";
import { SERVER_PORT } from "../constant";
import { get_default_os_and_hardware } from "./path";

export async function startServer(data: Data) {
  if (data.page === "CONVERSE" && data.modelStatus === "UNLOADED") {
    const { os } = get_default_os_and_hardware();

    console.log("launching on OS", os);

    await fetch("/start-server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ os }),
    });
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
          clearInterval(refreshID);
        }
      } catch {
        console.error("No server yet");
      }
    }, 1000);
  }
}
