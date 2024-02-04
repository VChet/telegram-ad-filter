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
      default: "https://github.com/VChet/telegram-ad-filter/raw/master/blacklist.json"
    }
  }
};
