import type { HardwareType, OSType } from "../../type";

interface CompSpec {
  os: OSType;
  hardware: HardwareType;
}

async function loadData(): Promise<null | CompSpec> {
  const file = Bun.file("./brain/meta.json");
  const fileExists = await file.exists();

  if (fileExists) {
    return (await file.json()) as CompSpec;
  } else {
    return null;
  }
}

async function writeData(new_data: CompSpec) {
  await Bun.write("./brain/meta.json", JSON.stringify(new_data));
}

export async function getCompSpecAPI() {
  const data = await loadData();
  if (data === null) return new Response(JSON.stringify({ status: "NEW" }));
  return new Response(JSON.stringify(data));
}

export async function createCompSpecAPI(req: Bun.BunRequest) {
  const newData = (await req.json()) as CompSpec;
  const oldData = await loadData();

  let { os, hardware } = newData;

  if (os === null) os = oldData!.os;
  if (hardware === null) hardware = oldData!.hardware;

  await writeData({ os, hardware });
  return new Response(JSON.stringify({ status: "success" }));
}
