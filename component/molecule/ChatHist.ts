import { GaiusMessage } from "../atom";

export default function ChatHist() {
  return `
  <chat-hist x-show="converseSubPage === 'CONVERSE'" x-init="func_s.pollServer($data)">
    <template x-if="hist.length === 0">
    <div x-show="modelStatus === 'LOADED'" style="margin: auto; display: flex; justify-content: center; font-weight: 700">
      ${GaiusMessage({ tone: "Yes", text: "Type a prompt in the box below to start a new chat" })}
      </div>
    </template>
    <template x-for="item in hist" :key="item.step">
    <gaius-message :class="item.role === 'user' ? 'user' : 'assistant'" ><div x-html="item.convert_content"></div></gaius-message>
    </template>

    <div x-show="modelStatus === 'UNLOADED'" style="margin: auto; display: flex; justify-content: center; font-weight: 700">
      ${GaiusMessage({ tone: "Loading", text: "Model Loading" })}
    </div>

    <div x-show="modelStatus === 'PROCESSING'" style="margin: auto; display: flex; justify-content: center; font-weight: 700">
      ${GaiusMessage({ tone: "Loading", text: "Processing Prompt" })}
    </div>

  </chat-hist>
  `;
}
