import { PDFParse } from "pdf-parse";

export async function parasePDFAPI(req: Bun.BunRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const text = await parsePDF(file);

  return new Response(JSON.stringify({ text }));
}

async function parsePDF(file: File) {
  const buffer = await file.arrayBuffer();
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  return result.text;
}
