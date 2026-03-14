import data from "./index.html"
import { $ } from "bun";

const server = Bun.serve({
  port: 3000,
routes: {
"/": data
}
});

console.log(`Listening on ${server.url}`);

await $`open http://localhost:3000`
