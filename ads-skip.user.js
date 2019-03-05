// ==UserScript==
// @name        Telegram Ad Skip
// @version     0.1.0
// @description 🤔
// @author      VChet
// @include     https://web.telegram.org/*
// @grant       GM_addStyle
// ==/UserScript==
"use strict";

const startScript = () => {
  let messages = document.querySelectorAll(".im_history_message_wrap");
  if (messages.length === messagesLength || messages.length === 0) return;
  messagesLength = messages.length;
  console.log({ messagesLength });
  messages.forEach(message => {
    if (adWords.some(v => message.innerText.indexOf(v) >= 0 )) {
      message = message.querySelector(".im_message_body");
      message.classList.add("advertisementMessage");
      message.onclick = () => message.classList.toggle("advertisementMessage");
    }
  });
}

const eventThrottler = delay => {
  if (!eventTimeout) {
    eventTimeout = setTimeout(() => {
      eventTimeout = null;
      startScript();
    }, delay);
  }
};

GM_addStyle(`
  .advertisementMessage {
    max-height: 40px;
  }
  .advertisementMessage > div:before {
    color: dodgerblue;
    font-weight: bold;
    text-decoration-style: dotted;
    content: "Advertisement";
  }
`);

const adWords = [
  "#взаимопиар",
  "#партнерский",
  "#постпроплачен",
  "#реклама",
  "#рекламныйпост",
  "#текстприслан",
];
let messagesLength;
let eventTimeout;
let delay = 3000;
// Run the script when an API message is received, throttled with delay
window.addEventListener("message", () => eventThrottler(delay), false);
