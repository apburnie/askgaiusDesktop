import { ChatHist } from "../molecule";
import { SendPrompt, Setting } from "../organism";

export default function Converse() {
  return `<converse-container x-show="page === 'CONVERSE'">
  ${Setting()}
  ${ChatHist()}
  ${SendPrompt()}
    </converse-container>`;
}
