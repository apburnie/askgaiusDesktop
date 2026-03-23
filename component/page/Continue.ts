import { GaiusButton } from "../atom";

export default function Continue() {
  return `
  <continue-container x-init="func_s.loadConversation_s($data)" x-show="page === 'CONTINUE'">
    <template x-for="meta in loadMeta" :key="meta.id">
      ${GaiusButton({ colour: "blue", text: '<load-option><div  x-text="new Date(meta.timeAtSave).toLocaleString()"></div><div x-text="meta.headerText"></div></load-option>', func: "async () => await func_s.switchForID(meta, $data)" })}
    </template>
      ${GaiusButton({ colour: "green", text: "🏛️ Home Page", func: "() => {page = 'WELCOME'; converseSubPage = 'CONVERSE', headerText = 'Gaius Chat';} " })}
  </continue-container>
  `;
}
