import { GaiusButton } from "../atom";

export default function ActionCol() {
  return `<action-col>
  ${GaiusButton({ colour: "green", text: "&uarr;", func: "func_s.submitPrompt($data)", attr: { style: "font-size:2rem;" } })}
  ${GaiusButton({ colour: "blue", text: "🗈", func: "() => {$data.converseSubPage = 'SETTING'}", attr: { style: "font-size:2rem;" } })}
  </action-col>`;
}
