import { GaiusButton } from "../atom";

export default function Continue() {
  return `
  <continue-container x-init="func_s.loadConversation_s($data)" x-show="page === 'CONTINUE'">
  ${GaiusButton({ colour: "green", text: "🏛️ Home Page", func: "() => {page = 'HOME'; converseSubPage = 'CONVERSE', headerText = 'Welcome to AskGaius';} " })}
   <template x-show="loadMeta.length > 0" x-for="meta in loadMeta" :key="meta.id">
     ${GaiusButton({ colour: "blue", text: '<load-option><div  x-text="new Date(meta.timeAtSave).toLocaleString()"></div><div x-text="func_s.getHeaderText(meta, 200)"></div></load-option>', func: "async () => await func_s.switchForID(meta, $data)" })}
   </template>
  </continue-container>
  `;
}
