import { GaiusButton, GaiusMessage } from "../atom";

export default function Continue() {
  return `
  <continue-container style="padding:0; gap:0" x-init="func_s.loadConversation_s($data)" x-show="page === 'CONTINUE'">
    <div style="border-bottom: 2px solid var(--gaius-light-grey-2); padding: 1rem;">
      ${GaiusButton({ colour: "green", text: "🏛️ Home Page", func: "() => {page = 'HOME'; converseSubPage = 'CONVERSE', headerText = 'Welcome to AskGaius';} ", attr: { style: "height:3rem;" } })}
    </div>
    <h2 x-show="loadMeta.length > 0" style="padding: 1rem; margin: 0">Select a Conversation to Continue</h2>
    <div style="height:calc(100svh - 5svh - 5rem); overflow: auto; display: flex; flex-direction: column; gap: 1rem; padding-left: 1rem; padding-right: 1rem;">
     <template x-show="loadMeta.length > 0" x-for="meta in loadMeta" :key="meta.id">
      ${GaiusButton({ colour: "blue", text: '<load-option><div  x-text="new Date(meta.timeAtSave).toLocaleString()"></div><div x-text="func_s.getHeaderText(meta, 200)"></div></load-option>', func: "async () => await func_s.switchForID(meta.id, $data)" })}
     </template>
    </div>
    <section style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem; ">
     <h2 style="margin:0">Synchronise Chat Histories</h2>
     <div x-show="loadMeta.length > 0">
       ${GaiusButton({ colour: "blue", text: "Download Backup of All Conversations", func: "async () => await func_s.downloadSemper($data)" })}
     </div>
     <div style="width: 100%"; height: 3rem >
      <label style="width: 100%" class="GaiusButton green" for="semperUpload">Upload Backup</label>
      <input id="semperUpload" type="file" x-ref="file" @change="func_s.parseSemper($event.target.files[0], $data)">
     </div>
    </section>
    <backup-loading x-show="backupLoading" style="position:absolute; right:calc(50% - 10rem); top:calc(50% - 3rem); width:20rem; height:3rem; border:2px solid var(--gaius-dark-grey); border-radius:10px; background:var(--gaius-yellow)">
    <div style="position: absolute;
    left: calc(50% - 7rem);
    width: 15rem;
    height: 1.5rem;
    top: calc(100% - 2.2rem);
    font-weight: bold;">
    Backup Loading - Please Wait
    </div>
    </backup-loading>
  </continue-container>
  `;
}
