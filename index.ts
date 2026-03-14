import { $ } from "bun";
import Page from "./ui/build/index.html"
import ExampleText from "./example" with {type: "text"}

console.log(ExampleText)

const server = Bun.serve({
  port: 3000,
routes: {
"/": Page,
"/console-test": async req => {

const value = await $`echo hello from bun`.text();

return new Response(value)


}
}
});

console.log(`Listening on ${server.url}`);

await $`open http://localhost:3000`
