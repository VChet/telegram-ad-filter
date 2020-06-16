// ==UserScript==
// @name        Telegram Ad Filter
// @version     0.3.2
// @description Collapses messages that contain words from the ad-word list
// @license     MIT
// @author      VChet
// @icon        https://web.telegram.org/favicon.ico
// @namespace   Telegram-Ad-Filter
// @include     https://web.telegram.org/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @updateURL   https://raw.githubusercontent.com/VChet/Telegram-Ad-Filter/master/tg-ad-filter.user.js
// @downloadURL https://raw.githubusercontent.com/VChet/Telegram-Ad-Filter/master/tg-ad-filter.user.js
// ==/UserScript==

/* jshint esversion: 6 */
(function main() {
  let defaultList = [
    "#advertisement",
    "#promo",
  ];

  if (navigator.language === "ru-RU") {
    defaultList = [
      "#взаимопиар",
      "#партнерский",
      "#постпроплачен",
      "#реклама",
      "#рекламныйпост",
      "#текстприслан",
    ];
  }

  let messages;
  let messagesLength;
  let adWords = GM_getValue("ad-words", defaultList);
  let delay = GM_getValue("update-interval", 3000);
  let eventTimeout;

  function applyStyles(messagesWrappers) {
    // console.log({ adWords });
    messagesWrappers.forEach(messageWrapper => {
      const message = messageWrapper.querySelector(".im_message_body");
      if (!message) return;
      if (message.innerText && adWords.some(v => message.innerText.toLowerCase().indexOf(v.toLowerCase()) >= 0)) {
        message.classList.add("advertisementMessage");
        const fwdMessage = message.querySelector(".im_message_fwd_from");
        if (fwdMessage) fwdMessage.style.display = "none";
        message.onclick = () => {
          message.classList.toggle("advertisementMessage");
          if (fwdMessage) fwdMessage.style.display = fwdMessage.style.display === "none" ? "block" : "none";
        };
      } else {
        message.classList.remove("advertisementMessage");
        message.onclick = null;
      }
    });
  }

  function eventThrottler(timeout) {
    if (!eventTimeout) {
      eventTimeout = setTimeout(() => {
        eventTimeout = null;
        messages = document.querySelectorAll(".im_history_message_wrap");
        if (messages.length === messagesLength || messages.length === 0) return;
        messagesLength = messages.length;
        // console.log({ messagesLength });
        applyStyles(messages);
      }, timeout);
    }
  }

  GM_addStyle(`
    .advertisementMessage {
      max-height: 40px;
    }
    .advertisementMessage > div:before {
      color: dodgerblue;
      font-weight: bold;
      text-decoration: underline dotted;
      content: "Advertisement";
    }
  `);

  GM_registerMenuCommand("Filter list", () => {
    const wordList = GM_getValue("ad-words", adWords);
    let val = prompt("Enter words to filter, separated by comma:", wordList);
    if (val !== null && typeof val === "string") {
      // Convert string to array, remove empty entries, trim values
      val = val.split(",").filter(v => v).map(v => v.trim());
      adWords = val;
      GM_setValue("ad-words", val);
      messages = document.querySelectorAll(".im_history_message_wrap");
      applyStyles(messages);
    }
  });

  GM_registerMenuCommand("Update interval", () => {
    const updateInteval = GM_getValue("update-interval", delay);
    const val = prompt("Enter message scanning frequency (in ms):", updateInteval);
    if (val !== null && typeof val === "string") {
      delay = val;
      GM_setValue("update-interval", val);
    }
  });

  // Run the script when an API message is received, throttled with delay
  window.addEventListener("message", () => eventThrottler(delay), false);
}());
