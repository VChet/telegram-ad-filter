export const bubbleStyle = `
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

export const frameStyle = `
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

export const popupStyle = `
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

export function addSettingsButton(node, callback) {
  const settingsButton = document.createElement("button");
  settingsButton.classList.add("btn-icon", "rp");
  settingsButton.setAttribute("title", "Telegram Ad Filter Settings");

  const ripple = document.createElement("div");
  ripple.classList.add("c-ripple");
  const icon = document.createElement("span");
  icon.classList.add("tgico", "button-icon");
  icon.textContent = "\uEA1C";
  settingsButton.append(ripple);
  settingsButton.append(icon);

  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    callback();
  });

  node.append(settingsButton);
}

export function handleMessageNode(node, adWords) {
  const message = node.querySelector(".message");
  if (!message?.textContent || node.querySelector(".advertisement")) { return; }
  const hasAdWord = adWords.some((filter) => message.textContent.toLowerCase().includes(filter.toLowerCase()));
  if (!hasAdWord) { return; }

  const trigger = document.createElement("div");
  trigger.classList.add("advertisement");
  trigger.textContent = "Hidden by filter";
  node.querySelector(".bubble-content").prepend(trigger);

  node.classList.add("has-advertisement");
  trigger.addEventListener("click", () => { node.classList.remove("has-advertisement"); });
  message.addEventListener("click", () => { node.classList.add("has-advertisement"); });
}
