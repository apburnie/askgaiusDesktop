import { GaiusMessage, GaiusButton } from "../atom";

export default function ChatHist() {
  return `
  <chat-hist x-show="converseSubPage === 'CONVERSE'">
    <template x-if="hist.length === 0">
    <div x-show="modelStatus === 'LOADED'" style="margin: auto; display: flex; justify-content: center; font-weight: 700">
      ${GaiusMessage({ tone: "Yes", text: "Type a prompt in the box below to start a new chat" })}
      </div>
    </template>

    <template x-for="item in hist" :key="item.step">
    <div>
    <details x-show="item.convert_thought">
      <summary>
      Thinking
      </summary>
      <gaius-message :class="'Maybe'" ><div x-html="item.convert_thought"></div></gaius-message>
    </details>
    <gaius-message :class="item.role === 'user' ? 'user' : 'assistant'" ><div x-html="item.convert_content"></div></gaius-message>
    </div>
    </template>


    <gaius-message :class="'assistant'" >
    <div x-text="runAns"></div>
    </gaius-message>


    <div x-show="modelStatus === 'UNLOADED'" style="margin: auto; display: flex; justify-content: center; font-weight: 700">
      ${GaiusMessage({ tone: "Loading", text: "Model Loading" })}
    </div>

    <div x-show="modelStatus === 'PROCESSING'" style="margin: auto; display: flex; justify-content: center; font-weight: 700">
    <gaius-message :class="'Loading'" >
    <div x-text="processText"></div>
    </gaius-message>
    </div>

    <gaius-message x-show="modelStatus === 'PROCESSING'">
    ${GaiusButton({ colour: "red", text: "Stop text generation", func: "() => {$data.killStream = true}" })}
    </gaius-message>


  </chat-hist>
  `;
}
