import { addSettingsButton, globalStyles, handleMessageNode } from "./DOM";
import { settingsConfig } from "./configs";
import { fetchLists } from "./fetch";

(async() => {
  GM_addStyle(globalStyles);

  let adWords: string[] = [];
  const gmc = new GM_configStruct({
    ...settingsConfig,
    events: {
      init: async function() { adWords = await fetchLists(this.get("listUrls").toString()); },
      save: async function() {
        try {
          adWords = await fetchLists(this.get("listUrls").toString());
          this.close();
        } catch (error) {
          alert(error instanceof Error ? error.message : String(error));
        }
      }
    }
  });

  function walk(node: Node): void {
    if (!(node instanceof HTMLElement) || !node.nodeType) { return; }
    let child = null;
    let next = null;
    switch (node.nodeType) {
      case node.ELEMENT_NODE:
      case node.DOCUMENT_NODE:
      case node.DOCUMENT_FRAGMENT_NODE:
        if (node.matches(".chat-utils")) { addSettingsButton(node, () => { gmc.open(); }); }
        if (node.matches(".bubble")) { handleMessageNode(node, adWords); }
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          walk(child);
          child = next;
        }
        break;
      case node.TEXT_NODE:
      default:
        break;
    }
  }

  function mutationHandler(mutationRecords: MutationRecord[]): void {
    for (const { type, addedNodes } of mutationRecords) {
      if (type === "childList" && typeof addedNodes === "object" && addedNodes.length) {
        for (const node of addedNodes) { walk(node); }
      }
    }
  }

  const observer = new MutationObserver(mutationHandler);
  observer.observe(document, { childList: true, subtree: true, attributeFilter: ["class"] });
})();
