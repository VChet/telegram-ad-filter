// ==UserScript==
// @name        Telegram Ad Filter
// @version     1.0.1
// @description Collapses messages that contain words from the ad-word list
// @license     MIT
// @author      VChet
// @icon        https://web.telegram.org/favicon.ico
// @namespace   telegram-ad-filter
// @match       https://web.telegram.org/k/*
// @grant       GM_addStyle
// @updateURL   https://raw.githubusercontent.com/VChet/telegram-ad-filter/master/tg-ad-filter.user.js
// @downloadURL https://raw.githubusercontent.com/VChet/telegram-ad-filter/master/tg-ad-filter.user.js
// ==/UserScript==

/* jshint esversion: 11 */
(async() => {
  GM_addStyle(`
    .bubble:not(.has-advertisement) .advertisement,
    .bubble.has-advertisement .bubble-content *:not(.advertisement) {
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
  `);

  async function fetchWords() {
    const response = await fetch("https://raw.githubusercontent.com/VChet/telegram-ad-filter/master/blacklist.json");
    return await response.json();
  }

  function applyStyles(node) {
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

  function walk(node) {
    if (!node.nodeType) { return; }
    let child = null;
    let next = null;
    switch (node.nodeType) {
      case 1: // Element
      case 9: // Document
      case 11: // Document fragment
        if (node.matches(".bubble")) { applyStyles(node); }
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          walk(child);
          child = next;
        }
        break;
      case 3: // Text node
      default:
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

  const adWords = await fetchWords();
  const observer = new MutationObserver(mutationHandler);
  observer.observe(document, { childList: true, subtree: true, attributeFilter: ["class"] });
})();
