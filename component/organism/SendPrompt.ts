import { GaiusTextArea, GaiusButton } from "../atom";
import { ActionCol } from "../molecule";

const gta = GaiusTextArea({ bindTo: "prompt", rows: "5", id: "prompt" });
const aC = ActionCol();

export default function SendPrompt() {
  return `<send-prompt x-show="modelStatus === 'LOADED'" @keyup.shift.enter="func_s.submitPrompt($data)">
            <system-prompt-container>
              ${gta}
              <system-prompt-mode x-show="systemPromptMode === 'PROMPT_TRAINER'">
                <div>${GaiusButton({ colour: "blue", text: "&#xd7;", func: "() => {$data.systemPromptMode = 'BASE'}" })}</div>
                <div>Prompt Trainer</div>
               </system-prompt-mode>
            </system-prompt-container>
            ${aC}
          </send-prompt>`;
}
