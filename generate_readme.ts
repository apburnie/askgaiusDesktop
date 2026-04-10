const content = [
  "# Specifications",
  "",
  "Product: AskGaius 0.01",
  `Creation Date: ${new Date().toUTCString()}`,
];

await Bun.write("./AskGaius/README.txt", content.join("\n"));
