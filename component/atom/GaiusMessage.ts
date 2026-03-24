export default function GaiusMessage(props: {
  tone: "Yes" | "No" | "Maybe" | "Loading";
  text: string;
  attr?: { [key: string]: string };
}) {
  const attrBlock = [];

  if (props.attr) {
    for (const key of Object.keys(props.attr)) {
      attrBlock.push(`${key}=${props.attr[key]}`);
    }
  }

  attrBlock.push(`class="${props.tone}"`);

  const attrString = attrBlock.join(" ");

  return `
  <gaius-message ${attrString} >
    <div style="display: flex; flex-direction: row; gap: 1rem;">
       <div>${props.text}</div>
       <div class="spin" style="display: ${props.tone === "Loading" ? "inline" : "none"}">🛞</div>
    </div>
  </gaius-message>`;
}
