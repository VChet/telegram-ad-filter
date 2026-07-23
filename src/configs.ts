import { frameStyle, popupStyle } from "./DOM";
import pkg from "../package.json";

const title = document.createElement("div");
title.innerHTML = `
  Telegram Ad Filter Settings
  <p class="subtitle">
    <a href="https://github.com/VChet/telegram-ad-filter/releases" target="_blank">v${pkg.version}</a>
  </p>
  <p class="subtitle">
    Suggest new words to filter in the <a href="https://github.com/VChet/telegram-ad-filter/discussions" target="_blank">discussions</a>.
  </p>
`;

export const settingsConfig: InitOptions<"textarea"> = {
  id: "telegram-ad-filter",
  frameStyle,
  css: popupStyle,
  title,
  fields: {
    listUrls: {
      label: "Blacklist URLs (one per line) – each URL must be a publicly accessible JSON file containing an array of blocked words or phrases",
      type: "textarea",
      default: "https://raw.githubusercontent.com/VChet/telegram-ad-filter/master/blacklist.json"
    }
  }
};
