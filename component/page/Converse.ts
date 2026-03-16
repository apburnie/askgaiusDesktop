import { ChatHist } from "../molecule";
import { SendPrompt } from "../organism";

export default function Converse() {
  return `<converse-container x-show="page === 'CONVERSE'">
  ${ChatHist([])}
  ${SendPrompt()}
    </converse-container>`;
}
