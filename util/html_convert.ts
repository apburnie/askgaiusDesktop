import type { Data } from "../type";
import Turndownservice from "turndown";

export async function printHist(data: Data) {
  const convert_content = data.hist.map(({ role, convert_content }) => {
    if (role === "user") {
      return `<user-content>${convert_content}</user-content>`;
    }
    if (role === "assistant") {
      return `<ai-content>${convert_content}</ai-content>`;
    }
  });

  const html = `<!DOCTYPE html>
    <html lang="en-US">
    <head>
    <meta charset="UTF-8"/>
    <title>AskGaius: ${data.headerText}</title>
    <style>
    user-content, ai-content {
    display: block;
    font-family: Arial, sans-serif;
    }
    user-content {
    border: 2px solid black;
    border-radius: 10px;
    padding: 1rem;
    }
    </style>
    </head>
    <body>${convert_content.join("")}</body>
    </html>`;

  data.hist;

  const a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:text/html;charset=UTF-8," + encodeURIComponent(html),
  );
  a.setAttribute("download", `AskGaius_${Date.now()}.html`);
  a.click();
}

export async function parseHTML(file: File, data: Data) {
  const html_text = await file.text();
  const turndown = new Turndownservice();
  data.prompt = turndown.turndown(html_text).replace(/[\n]+/g, " ");
  data.converseSubPage = "CONVERSE";
}
