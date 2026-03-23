import logo from "../asset/Logo.svg";
import { GaiusButton } from "../atom";

export default function Welcome() {
  return `<welcome-container x-show="page === 'WELCOME'">
  <h1>Welcome to AskGaius</h1>
  <image-container><img src=${logo}></img></image-container>
  <option-container>
  ${GaiusButton({ colour: "green", text: "Start", func: "() => {page = 'HOME'; } " })}
  ${GaiusButton({ colour: "blue", text: "Customise", func: "() => {page = 'CUSTOM';} " })}
  </option-container>
  </welcome-container>`;
}
