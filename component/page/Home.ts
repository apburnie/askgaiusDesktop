import { GaiusButton } from "../atom";
import Logo from "../asset/AskGaiusLogo.svg";
export default function Home() {
  return `<home-container x-show="page === 'HOME'">
  <img style="height: 50%" src=${Logo} alt="AskGaius Logo"/>
    ${GaiusButton({ colour: "blue", text: "New", func: "() => func_s.startNewSession($data) " })}
    ${GaiusButton({ colour: "blue", text: "Load", func: "() => {page = 'CONTINUE'; }" })}
    ${GaiusButton({ colour: "blue", text: "Download Backup", func: "async () => await func_s.downloadBackup()" })}
    ${GaiusButton({ colour: "red", text: "Delete", func: "() => {page = 'DELETE'; }" })}
    </home-container>`;
}
