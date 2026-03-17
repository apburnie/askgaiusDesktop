import { GaiusTextArea } from "../atom";
import { ActionCol } from "../molecule";

const gta = GaiusTextArea({ bindTo: "prompt", rows: "5", id: "prompt" });
const aC = ActionCol();

export default function SendPrompt() {
  return `<send-prompt x-show="modelStatus === 'LOADED'" @keyup.shift.enter="func_s.submitPrompt($data)">${gta}${aC}</send-prompt>`;
}
