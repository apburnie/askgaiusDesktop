const content = [
  "# Specifications",
  "",
  "Product: AskGaius 0.01",
  `Version Build Date: ${new Date().toUTCString()}`,
];

await Bun.write("./AskGaius/VERSION.txt", content.join("\n"));
