import { GaiusButton } from "../atom";

export default function ActionCol() {
  return `<action-col>${GaiusButton({ colour: "green", text: "&uarr;", func: "func_s.submitPrompt($data)" })}</action-col>`;
}
