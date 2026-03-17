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

  attrBlock.push(`class="GaiusButton ${props.tone}"`);

  const attrString = attrBlock.join(" ");

  return `
  <gaius-message ${attrString} >
    ${props.text}
  </gaius-message>`;
}
