export default function GaiusButton(props: {
  colour: "green" | "red" | "blue";
  text: string;
  func: string;
  attr?: { [key: string]: string };
}) {
  const attrBlock = [];

  if (props.attr) {
    for (const key of Object.keys(props.attr)) {
      attrBlock.push(`${key}=${props.attr[key]}`);
    }
  }

  attrBlock.push(`x-on:click="${props.func}"`);
  attrBlock.push(`class="GaiusButton ${props.colour}"`);

  const attrString = attrBlock.join(" ");

  return `
  <button ${attrString}>
    ${props.text}
  </button>`;
}
