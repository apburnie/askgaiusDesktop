import { GaiusTextArea, GaiusButton } from "../atom";
import { ActionCol } from "../molecule";

const gta = GaiusTextArea({ bindTo: "prompt", rows: "5", id: "prompt" });
const aC = ActionCol();

export default function SendPrompt() {
  return `<send-prompt x-show="modelStatus === 'LOADED'" @keyup.shift.enter="func_s.submitPrompt($data)">
            <system-prompt-container >
              ${gta}
              <system-prompt-mode x-show="systemPromptMode === 'PROMPT_TRAINER'">
                <div>${GaiusButton({ colour: "blue", text: "&#xd7;", func: "() => {$data.systemPromptMode = 'BASE'}", attr: { style: "height:100%" } })}</div>
                <div>🎓 Score Prompt from 1 (worst) to 5 (best)</div>
               </system-prompt-mode>
               <system-prompt-mode x-show="systemPromptMode === 'GOLDFISH'">
                 <div>${GaiusButton({ colour: "blue", text: "&#xd7;", func: "() => {$data.systemPromptMode = 'BASE'}", attr: { style: "height:100%" } })}</div>
                 <div>🐠 No Memory Mode</div>
                </system-prompt-mode>
                <system-prompt-mode x-show="systemPromptMode === 'WEBSEARCH'">
                  <div>${GaiusButton({ colour: "blue", text: "&#xd7;", func: "() => {$data.systemPromptMode = 'BASE'}", attr: { style: "height:100%" } })}</div>
                  <div>🌍 Search the Internet</div>
                 </system-prompt-mode>
                             </system-prompt-container>
            ${aC}
          </send-prompt>


              <gaius-message x-show="modelStatus === 'PROCESSING'">
              ${GaiusButton({ colour: "red", text: "Stop text generation", func: "() => {$data.killStream = true}" })}
              </gaius-message>

              <div x-show="modelStatus === 'PROCESSING'" style="margin: auto; display: flex; justify-content: center; font-weight: 700">
                  <gaius-message :class="'Loading'" >
                  <div x-text="processText"></div>
                  </gaius-message>
                  </div>
                  <system-prompt-mode x-show="errorMessage !== null">
                    <div style="width:100%; background:var(--gaius-light-red); display: flex; justify-content: center; align-items: center; font-weight: 700; " x-text="errorMessage"></div>
                   </system-prompt-mode>



          `;
}
