export const globalStyles = `
  .advertisement {
    padding: 0.5rem 1rem;
    font-size: var(--messages-text-size);
    font-style: italic;
    font-weight: var(--font-weight-bold);
    color: var(--link-color);
    white-space: nowrap;
    cursor: pointer;
  }
  #telegram-ad-filter-settings {
    display: inline-flex;
    justify-content: center;
    width: 24px;
    font-size: 24px;
    color: transparent;
    text-shadow: 0 0 var(--secondary-text-color);
  }
  .bubble.is-sponsored {
    display: none;
  }
  .bubble:not(.has-advertisement) .advertisement,
  .bubble.has-advertisement .bubble-content *:not(.advertisement),
  .bubble.has-advertisement .reply-markup {
    display: none;
  }
`;

export const frameStyle = `
  inset: 115px auto auto 130px;
  border: none;
  height: 325px;
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
    color: #fff;
    background: #181818;
    a {
      color: inherit;
    }
    textarea {
      width: 100%;
      min-height: 150px;
      resize: vertical;
    }
    .subtitle {
      margin-block: 4px;
      font-size: 12px;
    }
  }
  #telegram-ad-filter .reset,
  #telegram-ad-filter .reset a,
  #telegram-ad-filter_buttons_holder {
    color: inherit;
  }
`;

export function addSettingsButton(element: HTMLElement, callback: Function): void {
  const settingsButton = document.createElement("button");
  settingsButton.classList.add("btn-icon", "rp");
  settingsButton.setAttribute("title", "Telegram Ad Filter Settings");

  const ripple = document.createElement("div");
  ripple.classList.add("c-ripple");
  const icon = document.createElement("span");
  icon.id = "telegram-ad-filter-settings";
  icon.textContent = "⚙️";
  settingsButton.append(ripple);
  settingsButton.append(icon);

  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    callback();
  });

  element.append(settingsButton);
}

export function handleMessageNode(node: HTMLElement, adWords: string[]): void {
  const message = node.querySelector(".message");
  if (!message || node.querySelector(".advertisement")) { return; }

  const textContent = message.textContent?.toLowerCase();
  const links = [...message.querySelectorAll("a")].reduce((acc: string[], { href }) => {
    if (href) { acc.push(href.toLowerCase()); }
    return acc;
  }, []);
  if (!textContent && !links.length) { return; }

  const filters = adWords.map((filter) => filter.toLowerCase());
  const hasMatch = filters.some((filter) =>
    textContent?.includes(filter) || links.some((href) => href.includes(filter))
  );
  if (!hasMatch) { return; }

  const trigger = document.createElement("div");
  trigger.classList.add("advertisement");
  trigger.textContent = "Hidden by filter";
  node.querySelector(".bubble-content")?.prepend(trigger);

  node.classList.add("has-advertisement");
  trigger.addEventListener("click", () => { node.classList.remove("has-advertisement"); });
  message.addEventListener("click", () => { node.classList.add("has-advertisement"); });
}
