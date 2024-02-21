// ==UserScript==
// @name         Telegram Ad Filter
// @version      1.1.2
// @description  Collapses messages that contain words from the ad-word list
// @license      MIT
// @author       VChet
// @icon         https://web.telegram.org/favicon.ico
// @namespace    telegram-ad-filter
// @match        https://web.telegram.org/k/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @updateURL    https://github.com/VChet/telegram-ad-filter/raw/master/tg-ad-filter.user.js
// @downloadURL  https://github.com/VChet/telegram-ad-filter/raw/master/tg-ad-filter.user.js
// ==/UserScript==

/* jshint esversion: 11 */

const bubbleStyle = `
  .bubble:not(.has-advertisement) .advertisement,
  .bubble.has-advertisement .bubble-content *:not(.advertisement),
  .bubble.has-advertisement .reply-markup {
    display: none;
  }
  .advertisement {
    padding: 0.5rem 1rem;
    cursor: pointer;
    white-space: nowrap;
    font-style: italic;
    font-size: var(--messages-text-size);
    font-weight: var(--font-weight-bold);
    color: var(--link-color);
  }
`;

const frameStyle = `
  inset: 115px auto auto 130px;
  border: 1px solid rgb(0, 0, 0);
  height: 300px;
  margin: 0px;
  max-height: 95%;
  max-width: 95%;
  opacity: 1;
  overflow: auto;
  padding: 0px;
  position: fixed;
  width: 75%;
  z-index: 9999;
  display: block;
`;

const popupStyle = `
  #telegram-ad-filter {
    background: #181818;
    color: #ffffff;
  }
  #telegram-ad-filter textarea {
    resize: vertical;
    width: 100%;
    min-height: 150px;
  }
  #telegram-ad-filter .reset, #telegram-ad-filter .reset a, #telegram-ad-filter_buttons_holder {
    color: inherit;
  }
`;

function addSettingsButton(node, callback) {
  const settingsButton = document.createElement("button");
  settingsButton.classList.add("btn-icon", "rp");
  settingsButton.setAttribute("title", "Telegram Ad Filter Settings");

  const ripple = document.createElement("div");
  ripple.classList.add("c-ripple");
  const icon = document.createElement("span");
  icon.classList.add("tgico", "button-icon");
  icon.textContent = "\uE9DE";
  settingsButton.append(ripple);
  settingsButton.append(icon);

  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    callback();
  });

  node.append(settingsButton);
}

function handleMessageNode(node, adWords) {
  const message = node.querySelector(".message");
  if (!message?.textContent || node.querySelector(".advertisement")) return;
  const hasAdWord = adWords.some((filter) => message.textContent.toLowerCase().includes(filter.toLowerCase()));
  if (!hasAdWord) return;

  const trigger = document.createElement("div");
  trigger.classList.add("advertisement");
  trigger.textContent = "Blocked Ad";
  node.querySelector(".bubble-content").prepend(trigger);

  node.classList.add("has-advertisement");
  trigger.addEventListener("click", () => { node.classList.remove("has-advertisement"); });
  message.addEventListener("click", () => { node.classList.add("has-advertisement"); });
}

const settingsConfig = {
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

async function fetchLists(urlsString) {
  const urls = urlsString.trim().split("\n");
  const lists = await Promise.all(
    urls.map((url) => fetch(url)
      .then((response) => response.json())
      .catch((error) => alert(error))
    )
  );
  return [...new Set(lists.flat())];
}

(async() => {
  GM_addStyle(bubbleStyle);

  let adWords = [];
  const gmc = new GM_config({
    ...settingsConfig,
    events: {
      init: async function() { adWords = await fetchLists(this.get("listUrls")); },
      save: async function() {
        adWords = await fetchLists(this.get("listUrls"));
        this.close();
      }
    }
  });

  function walk(node) {
    if (!node.nodeType) { return; }
    let child = null;
    let next = null;
    switch (node.nodeType) {
      case 1: // Element
      case 9: // Document
      case 11: // Document fragment
        if (node.matches(".chat-utils")) { addSettingsButton(node, () => { gmc.open(); }); }
        if (node.matches(".bubble")) { handleMessageNode(node, adWords); }
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          walk(child);
          child = next;
        }
        break;
    }
  }

  function mutationHandler(mutationRecords) {
    for (const { type, addedNodes } of mutationRecords) {
      if (type === "childList" && typeof addedNodes === "object" && addedNodes.length) {
        for (const node of addedNodes) { walk(node); }
      }
    }
  }

  const observer = new MutationObserver(mutationHandler);
  observer.observe(document, { childList: true, subtree: true, attributeFilter: ["class"] });
})();
