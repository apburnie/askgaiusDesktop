import { GaiusButton } from "../atom";

export default function Delete() {
  return `
  <continue-container x-init="func_s.loadConversation_s($data)" x-show="page === 'DELETE'">
  ${GaiusButton({ colour: "green", text: "🏛️ Home Page", func: "() => {page = 'HOME'; converseSubPage = 'CONVERSE', headerText = 'Welcome to AskGaius';} " })}
  <div>
  <h1>Deleting a Conversation Cannot be Undone</h1>
  <p>Click on a conversation below to delete it</p>
  </div>
 <template x-for="meta in loadMeta" :key="meta.id">
 ${GaiusButton({ colour: "red", text: '<load-option><div  x-text="new Date(meta.timeAtSave).toLocaleString()"></div><div x-text="meta.headerText"></div></load-option>', func: "async () => await func_s.deleteByID(meta.id, $data)" })}
  </template>
  </continue-container>
  `;
}
