import { addSettingsButton, bubbleStyle, handleMessageNode } from "./DOM";
import { settingsConfig } from "./configs";
import { fetchLists } from "./fetch";

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

  const observer = new MutationObserver(mutationHandler);
  observer.observe(document, { childList: true, subtree: true, attributeFilter: ["class"] });
})();
