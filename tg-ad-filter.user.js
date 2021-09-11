// ==UserScript==
// @name        Telegram Ad Filter
// @version     0.4.1
// @description Collapses messages that contain words from the ad-word list
// @license     MIT
// @author      VChet
// @icon        https://web.telegram.org/favicon.ico
// @namespace   Telegram-Ad-Filter
// @include     https://web.telegram.org/k/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @updateURL   https://raw.githubusercontent.com/VChet/Telegram-Ad-Filter/master/tg-ad-filter.user.js
// @downloadURL https://raw.githubusercontent.com/VChet/Telegram-Ad-Filter/master/tg-ad-filter.user.js
// ==/UserScript==

/* jshint esversion: 10 */
(function () {
  let defaultList = ["#advertisement", "#promo"];
  if (navigator.language === "ru-RU") defaultList = ["#взаимопиар", "#партнерский", "#реклама", "#рекламный"];
  let adWords = GM_getValue("ad-words", defaultList);

  function applyStyles(node) {
    const message = node.querySelector(".message");
    if (!message?.innerText) return;
    const hasAdWord = adWords.some((filter) => message.innerText.toLowerCase().includes(filter.toLowerCase()));
    if (!hasAdWord || node.querySelector(".advertisement")) return;

    const trigger = document.createElement("div");
    trigger.classList.add("advertisement");
    trigger.innerText = "Advertisement";
    node.querySelector(".bubble-content").prepend(trigger);

    node.classList.add("hasAdvertisement");
    trigger.addEventListener("click", () => { node.classList.remove("hasAdvertisement"); });
    message.addEventListener("click", () => { node.classList.add("hasAdvertisement"); });
  }

  GM_addStyle(`
    .bubble:not(.hasAdvertisement) .advertisement,
    .bubble.hasAdvertisement .message,
    .bubble.hasAdvertisement .bubble-beside-button {
      display: none;
    }
    .advertisement {
      position: relative;
      padding: 0.5rem 1rem;
      text-decoration: underline dotted;
      cursor: pointer;
      font-weight: bold;
      color: var(--link-color);
    }
  `);

  GM_registerMenuCommand("Filter list", () => {
    const oldValue = GM_getValue("ad-words", adWords);
    const input = prompt("Enter words to filter, separated by comma:", oldValue);
    // Convert string to array, trim values
    const newValue = input.split(",").reduce((acc, entry) => {
      if (entry) acc.push(entry.trim());
      return acc;
    }, []);
    adWords = newValue;
    GM_setValue("ad-words", newValue);
    document.querySelectorAll(".bubble").forEach((message) => { applyStyles(message); });
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== "childList" || !mutation.addedNodes.length) return;
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.classList.contains("bubble")) applyStyles(node);
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true, attributeFilter: ["class"] });
}());
