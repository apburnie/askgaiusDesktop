import type { Data } from "../type";

import html2pdf from "html2pdf.js";

export async function printHist(data: Data) {
  const html = data.hist
    .map(({ convert_content }) => convert_content)
    .join("<hr>");
  html2pdf().set({ margin: 10 }).from(html).save();
}

export async function parsePDF(file: File, data: Data) {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await fetch("/parse-pdf", { method: "POST", body: formData });
  const respJSON = (await resp.json()) as { text: string };

  data.prompt = respJSON.text;
}
