import { frameStyle, popupStyle } from "./DOM";

export const settingsConfig: InitOptions<"textarea"> = {
  id: "telegram-ad-filter",
  frameStyle,
  css: popupStyle,
  title: "Telegram Ad Filter Settings",
  fields: {
    listUrls: {
      label: "Blacklist URLs (one per line) – each URL must be a publicly accessible JSON file containing an array of blocked words or phrases",
      type: "textarea",
      default: "https://raw.githubusercontent.com/VChet/telegram-ad-filter/master/blacklist.json"
    }
  }
};
