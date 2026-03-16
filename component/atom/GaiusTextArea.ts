export default function GaiusTextArea(props: {
  bindTo: string;
  rows: string;
  id: string;
}) {
  return `
  <gaius-text-area>
    <textarea rows=${props.rows} id=${props.id} x-model=${props.bindTo}></textarea>
  </gaius-text-area>
  `;
}
