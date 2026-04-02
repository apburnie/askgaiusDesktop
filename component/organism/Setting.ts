import { GaiusButton } from "../atom";

export default function Setting() {
  return `
  <setting-container x-show="converseSubPage === 'SETTING'">
  ${GaiusButton({ colour: "blue", text: "Switch to Prompt Trainer", func: "() => func_s.activatePromptTrainer($data)" })}
  ${GaiusButton({ colour: "blue", text: "Switch to No Memory Mode", func: "() => func_s.activateGoldfish($data)" })}
  ${GaiusButton({ colour: "blue", text: "Search The Internet", func: "() => func_s.activateWebSearch($data)" })}
  ${GaiusButton({ colour: "blue", text: "Print Conversation", func: "() => func_s.printHist($data)" })}
  <div>
  <label class="GaiusButton" for="pdfUpload">Upload HTML</label>
      <input id="pdfUpload" type="file" x-ref="file" @change="func_s.parsePDF($refs.file.files[0], $data)">
  </div>
  ${GaiusButton({ colour: "blue", text: "Back to Conversation", func: "() => {$data.converseSubPage = 'CONVERSE'} " })}
  ${GaiusButton({ colour: "blue", text: "🏛️ Home Page", func: "() => func_s.goToHomePage($data)" })}
  </setting-container>
  `;
}
