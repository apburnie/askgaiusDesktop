import { GaiusButton } from "../atom";
export default function Home() {
  return `<home-container x-show="page === 'HOME'">
    ${GaiusButton({ colour: "blue", text: "New", func: "() => func_s.startNewSession($data) " })}
    ${GaiusButton({ colour: "blue", text: "Load", func: "() => {page = 'CONTINUE'; }" })}
    </home-container>`;
}
