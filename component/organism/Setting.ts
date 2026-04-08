import { GaiusButton } from "../atom";

export default function Setting() {
  return `
  <setting-container x-show="converseSubPage === 'SETTING'">
  <setting-container style="padding: 0; height: 27rem;  border-bottom: 2px solid var(--gaius-light-grey-2);">
  <setting-container style="padding: 0; height: 15rem; border-bottom: 2px solid var(--gaius-light-grey-2);" x-show="systemPromptMode === 'BASE'">
  ${GaiusButton({ attr: { style: "height:3rem" }, colour: "blue", text: "Switch to Prompt Trainer", func: "() => func_s.activatePromptTrainer($data)" })}
  ${GaiusButton({ attr: { style: "height:3rem" }, colour: "blue", text: "Switch to No Memory Mode", func: "() => func_s.activateGoldfish($data)" })}
  ${GaiusButton({ attr: { style: "height:3rem" }, colour: "blue", text: "Search The Internet", func: "() => func_s.activateWebSearch($data)" })}
  </setting-container>
  <setting-container style="padding: 0; height: 15rem; border-bottom: 2px solid var(--gaius-light-grey-2); justify-content: center;"  x-show="systemPromptMode !== 'BASE'">
  ${GaiusButton({ attr: { style: "height:3rem" }, colour: "red", text: "Clear Special Mode", func: "() => func_s.clearSpecialMode($data)" })}
  </setting-container>
  ${GaiusButton({ attr: { style: "height:3rem" }, colour: "blue", text: "Print Conversation", func: "() => func_s.printHist($data)" })}
  <div>
  <label style="height: 3rem" class="GaiusButton" for="pdfUpload">Upload HTML</label>
      <input id="pdfUpload" type="file" x-ref="file" @change="func_s.parseHTML($refs.file.files[0], $data)">
  </div>
  </setting-container>
  ${GaiusButton({ colour: "green", text: "Back to Conversation", func: "() => {$data.converseSubPage = 'CONVERSE'} " })}
  ${GaiusButton({ colour: "red", text: "🏛️ Home Page", func: "() => func_s.goToHomePage($data)" })}
  </setting-container>
  `;
}
