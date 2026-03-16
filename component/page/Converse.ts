import { ChatHist } from "../molecule";
import { SendPrompt } from "../organism";

export default function Converse() {
  return `<converse-container x-init="func_s.startServer($data)" x-show="page === 'CONVERSE'">
  ${ChatHist()}
  ${SendPrompt()}
    </converse-container>`;
}
