import { GaiusButton } from "../atom";
export default function Home() {
  return `<home-container x-show="page === 'HOME'">
    ${GaiusButton({ colour: "blue", text: "Converse", func: "() => {page = 'CONVERSE'; headerText = 'Gaius Chat'; }" })}
    </home-container>`;
}
