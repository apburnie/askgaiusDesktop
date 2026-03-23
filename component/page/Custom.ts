import { GaiusButton } from "../atom";

export default function Custom() {
  return `
  <custom-container x-show="page === 'CUSTOM'">
  <h2>User Computer Settings</h2>
      <computer-spec>
        <label for="os">Operating System</label>
        <select id="os" x-model="os" x-effect="() => func_s.change_os(os)">
          <option selected='data.os === "UBUNTU"'>UBUNTU</option>
          <option selected='data.os === "WINDOWS"'>WINDOWS</option>
        </select>
      </computer-spec>
      <computer-spec>
        <label for="gpu">GPU API</label>
        <select id="gpu" x-model="hardware" x-effect="() => func_s.change_hardware(hardware)">
          <template x-for="hardwareOpt in func_s.getHardwareOpts($data)">
            <option x-text="hardwareOpt"></option>
          </template>
        </select>
      </computer-spec>
      <computer-spec>
      ${GaiusButton({ colour: "blue", text: "Revert Computer Settings to Default", func: "() => func_s.revert_default_os_and_hardware()" })}
      </computer-spec>
      <computer-spec>
      ${GaiusButton({ colour: "blue", text: "🏛️ Home Page", func: "() => {page = 'WELCOME';} " })}
      </computer-spec>
  </custom-container>
  `;
}
