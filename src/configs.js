import { frameStyle, popupStyle } from "./DOM";

export const settingsConfig = {
  id: "telegram-ad-filter",
  frameStyle,
  css: popupStyle,
  title: "Telegram Ad Filter Settings",
  fields: {
    listUrls: {
      label: "Blacklist URLs (one on each line)",
      type: "textarea",
      default: "https://raw.githubusercontent.com/VChet/telegram-ad-filter/master/blacklist.json"
    }
  }
};
