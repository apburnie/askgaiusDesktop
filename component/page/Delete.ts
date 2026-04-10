import { GaiusButton } from "../atom";

export default function Delete() {
  return `
  <continue-container x-init="func_s.loadConversation_s($data)" x-show="page === 'DELETE'">
  <div style="border-bottom: 2px solid var(--gaius-light-grey-2); min-height: 5rem">
  ${GaiusButton({ colour: "green", text: "🏛️ Home Page", func: "() => {page = 'HOME'; converseSubPage = 'CONVERSE', headerText = 'Welcome to AskGaius';} ", attr: { style: "height:3rem;" } })}
  </div>
  <div x-show="loadMeta.length > 0"  style="display: flex; flex-direction:column; align-items:center;">
  <div style="height:3rem;">Click on a conversation below to delete it</div>
  <div style="font-weight:700; height:3rem;">Deleting a Conversation Cannot be Undone</div>
  </div>
  <div style="height:calc(100svh - 5svh - 11rem); overflow: auto; display: flex; flex-direction: column; gap: 1rem; padding-right: 0.5rem; padding-left: 0.5rem;">
 <template x-for="meta in loadMeta" :key="meta.id">
 ${GaiusButton({ colour: "red", text: '<load-option><div  x-text="new Date(meta.timeAtSave).toLocaleString()"></div><div x-text="meta.headerText"></div></load-option>', func: "async () => await func_s.deleteByID(meta.id, $data)" })}
  </template>
  </div>
  </continue-container>
  `;
}
