import { GaiusMessage } from "../atom";

export default function ChatHist() {
  return `
  <chat-hist>
    <template x-if="hist.length === 0">
    <div style="margin: auto; display: flex; justify-content: center; font-weight: 700">
      ${GaiusMessage({ tone: "Yes", text: "Type a prompt in the box below to start a new chat" })}
      </div>
    </template>
    <template x-for="item in hist" :key="item.step">
    <gaius-message :class="item.role === 'user' ? 'user' : 'assistant'" x-text="item.content"></gaius-message>
    </template>
  </chat-hist>
  `;
}
