import { GaiusButton } from "../atom";
export default function Home() {
  return `<home-container x-show="page === 'HOME'">
    ${GaiusButton({ colour: "blue", text: "New", func: "() => func_s.startNewSession($data) " })}
    ${GaiusButton({ colour: "blue", text: "Load", func: "() => {page = 'CONTINUE'; }" })}
    ${GaiusButton({ colour: "blue", text: "Download Backup", func: "async () => await func_s.downloadBackup()" })}
    ${GaiusButton({ colour: "red", text: "Delete", func: "() => {page = 'DELETE'; }" })}
    </home-container>`;
}
